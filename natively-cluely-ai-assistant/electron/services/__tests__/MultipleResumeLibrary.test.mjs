// electron/services/__tests__/MultipleResumeLibrary.test.mjs
//
// Comprehensive test suite for Multiple Resume Library architecture:
// Test 1: User has one resume -> It can be selected as active.
// Test 2: User has three resumes -> Only one can be active.
// Test 3: Select Resume B -> Resume A becomes inactive.
// Test 4: Interview Copilot starts with Resume B selected -> receives Resume B context.
// Test 5: Resume A has "Infosys", Resume B has "Google" -> Resume B active yields Google, zero Infosys.
// Test 6: Switch Resume B -> Resume C -> Interview Copilot uses Resume C dynamically without restart.
// Test 7: Presentation/Summary/Custom modes remain unaffected (resume layer excluded/forbidden).

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

let Database;
try {
  Database = (await import('better-sqlite3')).default;
} catch {
  Database = null;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const P = (rel) => pathToFileURL(path.resolve(__dirname, rel)).href;

const { KnowledgeDatabaseManager } = await import(P('../../../dist-electron/premium/electron/knowledge/KnowledgeDatabaseManager.js'));
const { KnowledgeOrchestrator } = await import(P('../../../dist-electron/premium/electron/knowledge/KnowledgeOrchestrator.js'));
const { DocType } = await import(P('../../../dist-electron/premium/electron/knowledge/types.js'));
const { buildActiveProfileContext } = await import(P('../../../dist-electron/electron/llm/ActiveProfileContext.js'));
const { collectV3ProfileSources } = await import(P('../../../dist-electron/electron/services/knowledge/v3ProfileSources.js'));
const { buildContextRoute } = await import(P('../../../dist-electron/electron/llm/contextRoute.js'));

const RESUME_A_TEXT = `Alice Engineer
alice@example.com
EXPERIENCE
Senior Software Engineer | Infosys | 2020 - 2023
- Built backend microservices in Java and Spring Boot for banking clients
SKILLS
Java, Spring Boot, SQL, Oracle`;

const RESUME_B_TEXT = `Bob Cloud
bob@example.com
EXPERIENCE
Cloud Architect | Google | 2021 - 2024
- Architected Kubernetes clusters and BigQuery pipelines at Google Cloud
SKILLS
Go, Kubernetes, GCP, BigQuery, Docker`;

const RESUME_C_TEXT = `Charlie AI
charlie@example.com
EXPERIENCE
AI Researcher | Microsoft | 2022 - 2025
- Developed large language models and neural search at Microsoft Research
SKILLS
Python, PyTorch, Azure, LLM, OpenAI`;

import os from 'node:os';

function createInMemoryDb() {
  const profile_documents = new Map();
  const profile_nodes = new Map();

  return {
    exec() {},
    transaction(fn) {
      return (...args) => fn(...args);
    },
    close() {},
    prepare(sql) {
      const normalizedSql = sql.trim().replace(/\s+/g, ' ');
      return {
        all(...params) {
          if (normalizedSql.startsWith('PRAGMA table_info')) {
            return [
              { name: 'id' },
              { name: 'file_path' },
              { name: 'doc_type' },
              { name: 'raw_text' },
              { name: 'structured_data' },
              { name: 'created_at' },
              { name: 'title' },
              { name: 'file_name' },
              { name: 'is_active' },
              { name: 'updated_at' },
            ];
          }
          if (normalizedSql.includes("FROM profile_documents WHERE doc_type = 'resume'") || normalizedSql.includes('FROM profile_documents WHERE doc_type = "resume"')) {
            const list = Array.from(profile_documents.values()).filter(d => d.doc_type === 'resume');
            list.sort((a, b) => {
              if (b.is_active !== a.is_active) return b.is_active - a.is_active;
              return (b.created_at || '').localeCompare(a.created_at || '');
            });
            return list;
          }
          if (normalizedSql.includes('FROM profile_nodes WHERE category = ?')) {
            const [cat] = params;
            return Array.from(profile_nodes.values()).filter(n => n.category === cat);
          }
          if (normalizedSql.includes('FROM profile_nodes WHERE source_type = ?')) {
            const [st] = params;
            return Array.from(profile_nodes.values()).filter(n => n.source_type === st);
          }
          return [];
        },
        get(...params) {
          if (normalizedSql.includes("SELECT count(*) as count FROM profile_documents WHERE doc_type = 'resume' AND is_active = 1")) {
            const count = Array.from(profile_documents.values()).filter(d => d.doc_type === 'resume' && d.is_active === 1).length;
            return { count };
          }
          if (normalizedSql.includes("SELECT id FROM profile_documents WHERE doc_type = 'resume' ORDER BY created_at DESC LIMIT 1")) {
            const list = Array.from(profile_documents.values()).filter(d => d.doc_type === 'resume');
            list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
            return list[0] ? { id: list[0].id } : undefined;
          }
          if (normalizedSql.includes('FROM profile_documents WHERE doc_type = ?')) {
            const [docType] = params;
            const list = Array.from(profile_documents.values()).filter(d => d.doc_type === docType);
            list.sort((a, b) => {
              if (b.is_active !== a.is_active) return (b.is_active || 0) - (a.is_active || 0);
              return (b.created_at || '').localeCompare(a.created_at || '');
            });
            return list[0];
          }
          if (normalizedSql.includes('SELECT * FROM profile_documents WHERE id = ?') || normalizedSql.includes('SELECT is_active FROM profile_documents WHERE id = ?')) {
            const [id] = params;
            return profile_documents.get(id);
          }
          return undefined;
        },
        run(...params) {
          if (normalizedSql.includes("UPDATE profile_documents SET is_active = 0 WHERE doc_type = 'resume'")) {
            for (const doc of profile_documents.values()) {
              if (doc.doc_type === 'resume') {
                doc.is_active = 0;
              }
            }
            return { changes: 1 };
          }
          if (normalizedSql.includes("UPDATE profile_documents SET is_active = 1 WHERE id = ? AND doc_type = 'resume'")) {
            const [id] = params;
            const doc = profile_documents.get(id);
            if (doc && doc.doc_type === 'resume') {
              doc.is_active = 1;
              return { changes: 1 };
            }
            return { changes: 0 };
          }
          if (normalizedSql.includes("UPDATE profile_documents SET is_active = 1 WHERE id = ?")) {
            const [id] = params;
            const doc = profile_documents.get(id);
            if (doc) doc.is_active = 1;
            return { changes: doc ? 1 : 0 };
          }
          if (normalizedSql.includes("UPDATE profile_documents SET is_active = 1, updated_at = ? WHERE id = ? AND doc_type = 'resume'")) {
            const [updatedAt, id] = params;
            const doc = profile_documents.get(id);
            if (doc && doc.doc_type === 'resume') {
              doc.is_active = 1;
              doc.updated_at = updatedAt;
              return { changes: 1 };
            }
            return { changes: 0 };
          }
          if (normalizedSql.includes("UPDATE profile_documents SET title = ?, updated_at = ? WHERE id = ? AND doc_type = 'resume'")) {
            const [title, updatedAt, id] = params;
            const doc = profile_documents.get(id);
            if (doc && doc.doc_type === 'resume') {
              doc.title = title;
              doc.updated_at = updatedAt;
              return { changes: 1 };
            }
            return { changes: 0 };
          }
          if (normalizedSql.includes("UPDATE profile_documents SET raw_text = ?, structured_data = ?, title = COALESCE(?, title), updated_at = ? WHERE id = ?")) {
            const [rawText, structuredData, title, updatedAt, id] = params;
            const doc = profile_documents.get(id);
            if (doc) {
              doc.raw_text = rawText;
              doc.structured_data = structuredData;
              if (title) doc.title = title;
              doc.updated_at = updatedAt;
              return { changes: 1 };
            }
            return { changes: 0 };
          }
          if (normalizedSql.startsWith("INSERT INTO profile_documents")) {
            const [id, file_path, doc_type, raw_text, structured_data, created_at, title, file_name, is_active, updated_at] = params;
            profile_documents.set(id, {
              id,
              file_path,
              doc_type,
              raw_text,
              structured_data,
              created_at,
              title,
              file_name,
              is_active: Number(is_active),
              updated_at: updated_at || created_at,
            });
            return { changes: 1 };
          }
          if (normalizedSql.startsWith("INSERT INTO profile_nodes")) {
            const [id, source_id, source_type, category, title, content, text_content, metadata, created_at] = params;
            profile_nodes.set(id, {
              id,
              source_id,
              source_type,
              category,
              title,
              content,
              text_content,
              metadata,
              created_at,
            });
            return { changes: 1 };
          }
          if (normalizedSql.includes("DELETE FROM profile_documents WHERE id = ?")) {
            const [id] = params;
            profile_documents.delete(id);
            return { changes: 1 };
          }
          if (normalizedSql.includes("DELETE FROM profile_nodes WHERE source_id = ?")) {
            const [sourceId] = params;
            for (const [key, node] of profile_nodes.entries()) {
              if (node.source_id === sourceId) profile_nodes.delete(key);
            }
            return { changes: 1 };
          }
          if (normalizedSql.includes("DELETE FROM profile_documents WHERE doc_type = ?")) {
            const [docType] = params;
            for (const [key, doc] of profile_documents.entries()) {
              if (doc.doc_type === docType) profile_documents.delete(key);
            }
            return { changes: 1 };
          }
          if (normalizedSql.includes("DELETE FROM profile_nodes WHERE source_type = ?")) {
            const [st] = params;
            for (const [key, node] of profile_nodes.entries()) {
              if (node.source_type === st) profile_nodes.delete(key);
            }
            return { changes: 1 };
          }
          return { changes: 0 };
        }
      };
    }
  };
}

describe('Multiple Resume Library Architecture', () => {
  let tmpDir;
  let fileA, fileB, fileC;
  let db;
  let kdb;
  let orchestrator;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'meetfloo-multi-resume-test-'));
    fileA = path.join(tmpDir, 'resume_a_infosys.txt');
    fileB = path.join(tmpDir, 'resume_b_google.txt');
    fileC = path.join(tmpDir, 'resume_c_microsoft.txt');

    fs.writeFileSync(fileA, RESUME_A_TEXT, 'utf8');
    fs.writeFileSync(fileB, RESUME_B_TEXT, 'utf8');
    fs.writeFileSync(fileC, RESUME_C_TEXT, 'utf8');

    try {
      db = new Database(':memory:');
    } catch {
      db = createInMemoryDb();
    }
    kdb = new KnowledgeDatabaseManager(db);
    orchestrator = new KnowledgeOrchestrator(kdb);
    orchestrator.setKnowledgeMode(true);
    orchestrator.setGenerateContentFn(async () => {
      // Stub LLM extraction returning heuristic-like empty so heuristic parser kicks in accurately
      throw new Error('Fallback to heuristic');
    });
  });

  after(() => {
    try {
      db.close();
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch { /**/ }
  });

  test('Test 1: User has one resume -> It is automatically selected as active', async () => {
    const resA = await orchestrator.ingestDocument(fileA, DocType.RESUME, 'Infosys Resume');
    assert.equal(resA.success, true);

    const resumes = orchestrator.listResumes();
    assert.equal(resumes.length, 1);
    assert.equal(resumes[0].title, 'Infosys Resume');
    assert.equal(resumes[0].is_active, true);

    const activeDoc = orchestrator.getActiveResumeForInterview();
    assert.ok(activeDoc, 'Active resume must be present');
    assert.equal(activeDoc.title, 'Infosys Resume');
  });

  test('Test 2: User adds three resumes -> All exist in library and only ONE is active', async () => {
    const resB = await orchestrator.ingestDocument(fileB, DocType.RESUME, 'Google Resume');
    assert.equal(resB.success, true);

    const resC = await orchestrator.ingestDocument(fileC, DocType.RESUME, 'Microsoft Resume');
    assert.equal(resC.success, true);

    const resumes = orchestrator.listResumes();
    assert.equal(resumes.length, 3, 'Library must contain exactly 3 resumes');

    const activeList = resumes.filter((r) => r.is_active);
    assert.equal(activeList.length, 1, 'Exactly ONE resume must be active');
    assert.equal(activeList[0].title, 'Microsoft Resume', 'Most recently uploaded resume is default active');
  });

  test('Test 3: Select Resume B -> Resume B becomes ACTIVE and others become inactive', async () => {
    const resumesBefore = orchestrator.listResumes();
    const resumeB = resumesBefore.find((r) => r.title === 'Google Resume');
    assert.ok(resumeB, 'Google Resume must exist');

    const switchResult = orchestrator.setActiveResume(resumeB.id);
    assert.equal(switchResult.success, true);

    const resumesAfter = orchestrator.listResumes();
    const activeResumes = resumesAfter.filter((r) => r.is_active);
    assert.equal(activeResumes.length, 1, 'There must never be two active resumes');
    assert.equal(activeResumes[0].id, resumeB.id);
    assert.equal(activeResumes[0].title, 'Google Resume');

    const inactiveResumes = resumesAfter.filter((r) => !r.is_active);
    assert.equal(inactiveResumes.length, 2);
  });

  test('Test 4: Interview Copilot starts with Resume B selected -> receives Resume B context', async () => {
    const activeResume = orchestrator.getActiveResumeForInterview();
    assert.ok(activeResume);
    assert.equal(activeResume.title, 'Google Resume');

    const activeContext = buildActiveProfileContext(orchestrator);
    assert.ok(activeContext.activeResume);
    assert.equal(activeContext.activeResume.sourceId, activeResume.id);

    const rawOrStructuredText = JSON.stringify(activeContext.activeResume);
    assert.match(rawOrStructuredText, /Google/i);
    assert.match(rawOrStructuredText, /Kubernetes/i);
  });

  test('Test 5: Strict Isolation — Resume B active must NEVER leak Resume A (Infosys)', async () => {
    const activeContext = buildActiveProfileContext(orchestrator);
    const activeResumeJson = JSON.stringify(activeContext.activeResume);

    assert.match(activeResumeJson, /Google/i);
    assert.doesNotMatch(activeResumeJson, /Infosys/i, 'Resume A content must not leak into Resume B context');
    assert.doesNotMatch(activeResumeJson, /Oracle/i, 'Resume A skills must not leak into Resume B context');

    const v3Sources = collectV3ProfileSources(orchestrator);
    assert.equal(v3Sources.docs.length >= 1, true);
    const v3Json = JSON.stringify(v3Sources.docs);
    assert.match(v3Json, /Google/i);
    assert.doesNotMatch(v3Json, /Infosys/i);

    // Test RAG boundary retrieval abstraction
    const ragContext = await orchestrator.retrieveResumeContext({ query: 'Tell me about your experience' });
    assert.match(ragContext, /Google/i);
    assert.doesNotMatch(ragContext, /Infosys/i);
  });

  test('Test 6: Dynamic Switching: Switch Resume B -> Resume C without app restart', async () => {
    const resumes = orchestrator.listResumes();
    const resumeC = resumes.find((r) => r.title === 'Microsoft Resume');
    assert.ok(resumeC);

    const switchResult = orchestrator.setActiveResume(resumeC.id);
    assert.equal(switchResult.success, true);
    assert.equal(orchestrator.activeResume?.id, resumeC.id);

    const nextTurnContext = buildActiveProfileContext(orchestrator);
    const nextTurnJson = JSON.stringify(nextTurnContext.activeResume);

    assert.match(nextTurnJson, /Microsoft/i);
    assert.match(nextTurnJson, /PyTorch/i);
    assert.doesNotMatch(nextTurnJson, /Google/i, 'Previous active resume (Google) must be fully evicted');
    assert.doesNotMatch(nextTurnJson, /Infosys/i);
  });

  test('Test 7: Presentation / Summary / Custom modes remain completely unaffected', () => {
    // Presentation (sales) mode plan
    const presentationPlan = {
      answerType: 'general',
      source: 'llm',
      speakerPerspective: 'assistant',
      outputPerspective: 'assistant',
      voicePerspective: 'assistant',
      profileContextPolicy: 'forbidden',
      requiredContextLayers: ['reference_files'],
      forbiddenContextLayers: ['resume', 'jd', 'negotiation', 'stable_identity'],
      responseTemplate: 'freeform',
      maxFirstUsefulTokenMs: 800,
      maxInitialLatencyMs: 800,
      requiresLLM: true,
      canUseFastPath: false,
    };

    const presentationRoute = buildContextRoute(presentationPlan);
    assert.equal(presentationRoute.selectedLayers.includes('resume'), false);
    assert.equal(presentationRoute.excludedLayers.includes('resume'), true);

    // Summary mode plan
    const summaryPlan = {
      answerType: 'summary',
      source: 'llm',
      speakerPerspective: 'assistant',
      outputPerspective: 'assistant',
      voicePerspective: 'assistant',
      profileContextPolicy: 'forbidden',
      requiredContextLayers: ['live_transcript'],
      forbiddenContextLayers: ['resume', 'jd', 'negotiation'],
      responseTemplate: 'freeform',
      maxFirstUsefulTokenMs: 800,
      maxInitialLatencyMs: 800,
      requiresLLM: true,
      canUseFastPath: false,
    };

    const summaryRoute = buildContextRoute(summaryPlan);
    assert.equal(summaryRoute.selectedLayers.includes('resume'), false);
    assert.equal(summaryRoute.excludedLayers.includes('resume'), true);

    // Document grounded custom mode plan
    const customDocPlan = {
      answerType: 'custom_query',
      source: 'llm',
      speakerPerspective: 'assistant',
      outputPerspective: 'assistant',
      voicePerspective: 'assistant',
      profileContextPolicy: 'forbidden',
      documentGroundedCustomModeActive: true,
      requiredContextLayers: ['reference_files'],
      forbiddenContextLayers: ['resume', 'jd'],
      responseTemplate: 'freeform',
      maxFirstUsefulTokenMs: 800,
      maxInitialLatencyMs: 800,
      requiresLLM: true,
      canUseFastPath: false,
    };

    const customRoute = buildContextRoute(customDocPlan);
    assert.equal(customRoute.selectedLayers.includes('resume'), false);
    assert.equal(customRoute.excludedLayers.includes('resume'), true);
  });
});

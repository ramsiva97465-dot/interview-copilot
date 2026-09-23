import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const P = (rel) => pathToFileURL(path.resolve(__dirname, rel)).href;

const { buildCandidateProfileBlock } = await import(P('../../../dist-electron/premium/electron/knowledge/ProfileContextBuilder.js'));
const { KnowledgeOrchestrator } = await import(P('../../../dist-electron/premium/electron/knowledge/KnowledgeOrchestrator.js'));
const { KnowledgeDatabaseManager } = await import(P('../../../dist-electron/premium/electron/knowledge/KnowledgeDatabaseManager.js'));

describe('Supplementary Resume Notes & Paragraphs', () => {
    test('buildCandidateProfileBlock injects <candidate_supplementary_notes> when present', () => {
        const resumeDoc = {
            id: 1,
            type: 'resume',
            structured_data: {
                _schema_version: 2,
                identity: { name: 'Alex Mercer', summary: 'Senior Engineer' },
                skills: { languages: ['TypeScript', 'Go'] },
                supplementary_text: 'Key achievements: Led Kubernetes migration reducing latency by 40%.',
            }
        };

        const block = buildCandidateProfileBlock(resumeDoc);
        assert.ok(block.includes('<candidate_supplementary_notes>'));
        assert.ok(block.includes('Led Kubernetes migration reducing latency by 40%'));
        assert.ok(block.includes('</candidate_supplementary_notes>'));
    });

    test('buildCandidateProfileBlock omits <candidate_supplementary_notes> when empty or absent', () => {
        const resumeDocWithout = {
            id: 1,
            type: 'resume',
            structured_data: {
                _schema_version: 2,
                identity: { name: 'Alex Mercer' },
                skills: { languages: ['TypeScript'] },
            }
        };
        const block1 = buildCandidateProfileBlock(resumeDocWithout);
        assert.ok(!block1.includes('<candidate_supplementary_notes>'));

        const resumeDocEmpty = {
            id: 1,
            type: 'resume',
            structured_data: {
                ...resumeDocWithout.structured_data,
                supplementary_text: '   \n  ',
            }
        };
        const block2 = buildCandidateProfileBlock(resumeDocEmpty);
        assert.ok(!block2.includes('<candidate_supplementary_notes>'));
    });

    test('KnowledgeOrchestrator saves and retrieves supplementary resume notes', async () => {
        const sqliteDb = new Database(':memory:');
        try {
            const dbManager = new KnowledgeDatabaseManager(sqliteDb);
            const orchestrator = new KnowledgeOrchestrator(dbManager);

            // First, get when nothing exists
            assert.equal(orchestrator.getSupplementaryResumeText(), '');

            // Save supplementary text without existing PDF
            const note1 = 'Specialized in real-time WebRTC and distributed streaming.';
            const res1 = await orchestrator.saveSupplementaryResumeText(note1);
            assert.equal(res1.success, true);
            assert.equal(orchestrator.getSupplementaryResumeText(), note1);

            // Verify active resume was created and structured data has supplementary_text
            const profile = orchestrator.getProfileData();
            assert.ok(profile);
            assert.equal(orchestrator.getSupplementaryResumeText(), note1);

            // Verify knowledge node was created under category 'supplementary_notes'
            const nodes = dbManager.getAllNodes();
            const suppNode = nodes.find(n => n.category === 'supplementary_notes');
            assert.ok(suppNode, 'supplementary_notes node should be created in DB');
            assert.ok(suppNode.content.includes(note1));

            // Update with new content
            const note2 = 'Updated: Managed team of 8 engineers and increased deployment frequency by 3x.';
            const res2 = await orchestrator.saveSupplementaryResumeText(note2);
            assert.equal(res2.success, true);
            assert.equal(orchestrator.getSupplementaryResumeText(), note2);

            // Check that old node was replaced and updated
            const updatedNodes = dbManager.getAllNodes();
            const suppNodes = updatedNodes.filter(n => n.category === 'supplementary_notes');
            assert.equal(suppNodes.length, 1);
            assert.ok(suppNodes[0].content.includes(note2));
        } finally {
            sqliteDb.close();
        }
    });
});

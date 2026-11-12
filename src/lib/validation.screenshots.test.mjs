import assert from 'node:assert/strict';
import test from 'node:test';
import { projectCreateSchema, projectUpdateSchema, validate } from './validation.js';

const project = {
  title: 'Gallery project',
  description: 'A description that is long enough to pass validation.',
  category: 'Web Apps',
  hero_images: ['https://cdn.example/hero.jpg'],
  mockups: [],
};

const shots = (count) =>
  Array.from({ length: count }, (_, index) =>
    index % 2
      ? { url: `https://cdn.example/${index}.jpg`, layout: 'fullpage', caption: 'Shot' }
      : `https://cdn.example/${index}.jpg`
  );

test('creating a project accepts 15 mixed screenshot values', () => {
  const result = validate(projectCreateSchema, { ...project, screenshots: shots(15) });
  assert.equal(result.success, true);
});

test('creating or updating a project rejects a 16th screenshot', () => {
  const created = validate(projectCreateSchema, { ...project, screenshots: shots(16) });
  assert.equal(created.success, false);
  assert.equal(created.errors.screenshots, 'A project can include at most 15 screenshots.');

  const updated = validate(projectUpdateSchema, { screenshots: shots(16) });
  assert.equal(updated.success, false);
  assert.equal(updated.errors.screenshots, 'A project can include at most 15 screenshots.');
});

test('screenshot validation stays compatible with older payloads', () => {
  assert.equal(validate(projectCreateSchema, project).success, true);
  assert.equal(validate(projectCreateSchema, { ...project, screenshots: null }).success, true);
  assert.equal(
    validate(projectCreateSchema, { ...project, screenshots: { url: 'https://cdn.example/legacy.jpg' } }).success,
    true
  );
  assert.equal(validate(projectUpdateSchema, { publishing_status: 'published' }).success, true);
});

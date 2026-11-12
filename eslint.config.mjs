import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { defineConfig, globalIgnores } from 'eslint/config';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';

const importXFlatConfigs = importX.configs;

const tsRecommendedRules = tseslint.configs.recommended.reduce(
  (acc, config) => ({ ...acc, ...(config.rules ?? {}) }),
  {},
);

const sharedPlugins = {
  '@stylistic': stylistic,
  '@typescript-eslint': tseslint.plugin,
  '@next/next': nextPlugin,
  'better-tailwindcss': betterTailwindcss,
  'import-x': importX,
};

const sharedSettings = {
  ...importXFlatConfigs['flat/typescript'].settings,
  'better-tailwindcss': {
    entryPoint: 'src/app/globals.css',
  },
  react: {
    version: 'detect',
  },
};

/**
 * TS path-alias (`@/*`) resolution is scoped to `src/**` only — matches the
 * monorepo pattern of per-app resolver overrides (previously `appConfigs` in
 * minti-srm) and avoids type-aware import resolution on root-level tooling
 * files like this one, where it falsely flags dual CJS/ESM packages
 * (typescript-eslint, eslint-plugin-import-x, @next/eslint-plugin-next) via
 * `import-x/no-named-as-default-member`.
 */
const srcResolverConfig = {
  files: ['src/**/*.{js,mjs,cjs,ts,tsx}'],
  settings: {
    'import-x/resolver-next': [
      createTypeScriptImportResolver({
        alwaysTryTypes: true,
        project: './tsconfig.json',
      }),
    ],
  },
};

const stylisticRules = {
  '@stylistic/indent': ['error', 2],
  '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
  '@stylistic/semi': ['error', 'always'],
  '@stylistic/quote-props': ['error', 'as-needed'],
  '@stylistic/comma-dangle': ['error', 'always-multiline'],
  '@stylistic/arrow-parens': ['error', 'always'],
  '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
  '@stylistic/block-spacing': ['error', 'always'],
  '@stylistic/comma-spacing': ['error', { before: false, after: true }],
  '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
  '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
  '@stylistic/space-before-blocks': ['error', 'always'],
  '@stylistic/space-infix-ops': 'error',
  '@stylistic/object-curly-spacing': ['error', 'always'],
  '@stylistic/array-bracket-spacing': ['error', 'never'],
  '@stylistic/no-trailing-spaces': 'error',
  '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
  '@stylistic/padded-blocks': ['error', 'never'],
  '@stylistic/eol-last': ['error', 'always'],
  '@stylistic/no-multi-spaces': 'error',
  '@stylistic/semi-spacing': ['error', { before: false, after: true }],
  '@stylistic/space-before-function-paren': [
    'error',
    { anonymous: 'always', named: 'never', asyncArrow: 'always' },
  ],
  '@stylistic/type-annotation-spacing': 'error',
  '@stylistic/member-delimiter-style': [
    'error',
    {
      multiline: { delimiter: 'semi', requireLast: true },
      singleline: { delimiter: 'semi', requireLast: false },
    },
  ],
  '@stylistic/jsx-quotes': ['error', 'prefer-double'],
  '@stylistic/jsx-indent-props': ['error', 2],
  '@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],
  '@stylistic/jsx-closing-tag-location': 'error',
  '@stylistic/jsx-tag-spacing': [
    'error',
    {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never',
      beforeClosing: 'never',
    },
  ],
  '@stylistic/jsx-wrap-multilines': [
    'error',
    {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line',
    },
  ],
  '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
  '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
  '@stylistic/max-len': [
    'error',
    {
      code: 120,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    },
  ],
};

const importRules = {
  ...importXFlatConfigs['flat/recommended'].rules,
  ...importXFlatConfigs['flat/typescript'].rules,
  'import-x/no-duplicates': 'error',
  'import-x/no-named-as-default': 'error',
  'import-x/no-named-as-default-member': 'error',
  'import-x/order': [
    'error',
    {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
      pathGroups: [{ pattern: '@/**', group: 'internal' }],
      pathGroupsExcludedImportTypes: ['builtin'],
      'newlines-between': 'never',
    },
  ],
  'import-x/no-cycle': ['error', { maxDepth: 4 }],
};

const nextRules = {
  ...nextPlugin.configs.recommended.rules,
  ...nextPlugin.configs['core-web-vitals'].rules,
};

const tailwindRules = {
  ...betterTailwindcss.configs.recommended.rules,
  'better-tailwindcss/enforce-consistent-line-wrapping': 'error',
};

const eslintConfig = defineConfig([
  // JS/MJS files — no TypeScript parser, no type-aware rules
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: sharedPlugins,
    settings: sharedSettings,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...stylisticRules,
      curly: 'error',
      ...importRules,
      ...nextRules,
      ...tailwindRules,
    },
  },
  // TypeScript files — full rule set including type-aware TS rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: sharedPlugins,
    extends: [
      eslintReact.configs['strict'],
    ],
    settings: sharedSettings,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsRecommendedRules,
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      }],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'enumMember', format: ['PascalCase'] },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      ...stylisticRules,
      curly: 'error',
      ...importRules,
      ...nextRules,
      ...tailwindRules,
      '@eslint-react/use-state': 'error',
      // В strict-пресете это warn; пропущенная зависимость эффекта — реальный
      // баг (устаревшее замыкание), поэтому блокируем на CI.
      '@eslint-react/exhaustive-deps': 'error',
      '@eslint-react/dom-no-missing-button-type': 'off',
      // AGENTS.md §4: импортируй React-типы напрямую (`import type { ReactNode }
      // from 'react'`), не через `React.ReactNode`/`React.FC` и т.п.
      'no-restricted-syntax': [
        'error',
        {
          selector: "TSQualifiedName[left.name='React']",
          message: 'Импортируй тип напрямую (`import type { X } from \'react\'`), не используй `React.X` — см. AGENTS.md §4.',
        },
      ],
    },
  },
  // Доступность разметки (WCAG 2.2 AA — базовый стандарт проекта).
  // Строгий набор правил eslint-plugin-jsx-a11y применяется ко всем JSX-файлам.
  {
    ...jsxA11y.flatConfigs.strict,
    files: ['**/*.{jsx,tsx}'],
  },
  // AGENTS.md §6: компонент длиннее 300 строк — сигнал разбить. warn, не error,
  // т.к. решение "есть ли реальная причина" для большего файла требует
  // человеческого суждения, а не механической блокировки.
  {
    files: ['**/*.tsx'],
    rules: {
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
  srcResolverConfig,
  // ESLint's own flat config re-exports these ecosystem packages' dual
  // CJS/ESM default exports (e.g. `tseslint.configs`, `nextPlugin.configs`).
  // That's the documented, intended usage — not an accidental default/named
  // mix-up — so the import-x heuristic for it is a false positive here.
  {
    files: ['eslint.config.mjs'],
    rules: {
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    // Справочные материалы (исходные скрипты сборки набора данных и т.п.).
    'docs/**',
  ]),
]);

export default eslintConfig;

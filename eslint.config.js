import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
// const checkVueFilename = require('./scripts/check-vue-filename.mjs')
// import checkVueFilename from './scripts/check-vue-filename.mjs'

export default defineConfig([
    eslintPluginPrettierRecommended,

    tseslint.configs.recommended,
    pluginVue.configs['flat/recommended'],
    // // 需要忽略的文件
    {
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            'coverage/',
            '__tests__/',
            '*.log',
            '.DS_Store',
            '.env*',
            '*.local',
            'docs/**',
            'public/**',
            '*.config',
            '**/vendor/**',
            '**/static/**',
            '**/assets/**',
            '**/*.d.ts',
            '*.test.*',
            '*.spec.*',
            '*.d.ts',
            '*.d.mts',
            '*.d.cts',
            '*.d.tsx',
            '*.d.mtsx',
            '*.d.ctsx',
            '*.d.js',
            '*.d.mjs',
            '*.d.cjs',
            '*.d.jsx',
            '*.d.mjsx',
            '*.d.cjsx',
            '*.d.ts',
            '*.d.mts',
            '*.d.cts',
            '*.d.tsx',
            '*.d.mtsx',
            '*.d.ctsx',
            '*.d.js',
            '*.d.mjs',
            '*.d.cjs',
            '*.d.jsx',
            '*.d.mjsx',
            '*.d.cjsx'
        ]
    },

    // 基础配置
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2023
            },
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        linterOptions: {
            noInlineConfig: false
        },
        rules: {
            // 通用代码质量/格式规则：每条规则后紧跟说明
            'accessor-pairs': 2, // 强制getter/setter成对出现（如定义get name()必须有set name()）
            'arrow-spacing': [2, { before: true, after: true }], // 箭头函数=>前后必须有空格（如() => {}）
            'block-spacing': [2, 'always'], // 代码块{}前后必须有空格（如function() { }）
            'brace-style': [2, '1tbs', { allowSingleLine: true }], // 大括号1tbs风格（if() {），允许单行代码块
            camelcase: [0, { properties: 'always' }], // 变量/属性推荐驼峰命名（0=警告，如userName而非user_name）
            'comma-dangle': [2, 'never'], // 禁止尾逗号（如[1, 2]而非[1, 2,]）
            'comma-spacing': [2, { before: false, after: true }], // 逗号后必须有空格，前无空格（如a, b）
            'comma-style': [2, 'last'], // 逗号必须在句尾（如a, b而非a ,b）
            'constructor-super': 2, // 子类构造函数必须调用super()（ES6类继承规范）
            curly: [2, 'multi-line'], // 多行语句必须用{}包裹（如if(a) { b() }）
            'dot-location': [2, 'property'], // 点运算符必须跟在属性前（如obj.prop而非obj .prop）
            'eol-last': 2, // 文件末尾必须有一个空行（避免不同编辑器解析差异）
            eqeqeq: ['error', 'always', { null: 'ignore' }], // 强制用===/!==，忽略null的==比较（如x == null）
            'generator-star-spacing': [2, { before: true, after: true }], // Generator函数*前后必须有空格（如function* gen()）
            'handle-callback-err': [2, '^(err|error)$'], // 回调函数必须处理err/error参数（如(err) => { if(err) throw err }）
            indent: [2, 4, { SwitchCase: 1 }], // 缩进2个空格，switch case缩进1级（case内再缩2空格）
            'jsx-quotes': [2, 'prefer-single'], // JSX属性用单引号（如<div className='box' />）
            'key-spacing': [2, { beforeColon: false, afterColon: true }], // 对象键值冒号前无空格、后有空格（如{ a: 1 }）
            'keyword-spacing': [2, { before: true, after: true }], // 关键字（if/for）前后必须有空格（如if (a)而非if(a)）
            'new-cap': [2, { newIsCap: true, capIsNew: false }], // new后函数必须大写（如new User()），大写函数不一定是构造函数
            'new-parens': 2, // new构造函数必须带括号（如new User()而非new User）
            'no-array-constructor': 2, // 禁止用new Array()（用[]替代，避免歧义）
            'no-caller': 2, // 禁止用arguments.callee（避免性能问题，用函数名替代）
            'no-class-assign': 2, // 禁止类重赋值（如class A {}; A = {}）
            'no-cond-assign': 2, // 禁止条件语句中赋值（如if(a=1)禁止，应为if(a===1)）
            'no-const-assign': 2, // 禁止const变量重赋值（如const a=1; a=2禁止）
            'no-control-regex': 0, // 允许正则包含控制字符（0=关闭检查，如\x00）
            'no-delete-var': 2, // 禁止用delete删除变量（只能删除对象属性，如delete obj.a）
            'no-dupe-args': 2, // 禁止函数重复参数（如function(a,a)禁止）
            'no-dupe-class-members': 2, // 禁止类中重复方法（如class A { fn() {} fn() {} }禁止）
            'no-dupe-keys': 2, // 禁止对象重复键（如{ a:1, a:2 }禁止）
            'no-duplicate-case': 2, // 禁止switch case重复（如case 1: case 1:禁止）
            'no-empty-character-class': 2, // 禁止正则空字符类（如/[]/禁止，应为/^$/）
            'no-empty-pattern': 2, // 禁止空解构模式（如const {} = obj禁止，需明确解构属性）
            'no-eval': 2, // 禁止用eval()（避免安全风险和性能问题）
            'no-ex-assign': 2, // 禁止catch中重赋值error参数（如catch(e) { e=1 }禁止）
            'no-extend-native': 2, // 禁止修改原生对象原型（如Array.prototype.push = () => {}禁止）
            'no-extra-bind': 2, // 禁止不必要的bind()（如function fn() {}; fn.bind(this)无意义时禁止）
            'no-extra-boolean-cast': 2, // 禁止多余布尔转换（如!!a可简化为a时禁止）
            'no-extra-parens': [2, 'functions'], // 禁止函数调用多余括号（如(fn())禁止，应为fn()）
            'no-fallthrough': 2, // 禁止switch case穿透（必须有break/return，避免逻辑错误）
            'no-floating-decimal': 2, // 禁止省略整数部分的小数（如.5禁止，应为0.5）
            'no-func-assign': 2, // 禁止函数重赋值（如function fn() {}; fn = () => {}禁止）
            'no-implied-eval': 2, // 禁止隐含eval（如setTimeout('fn()')禁止，用setTimeout(fn)）
            'no-inner-declarations': [2, 'functions'], // 禁止块内声明函数（如if() { function fn() {} }禁止）
            'no-invalid-regexp': 2, // 禁止无效正则（如/[a-z禁止，需补全括号/[a-z]/）
            'no-irregular-whitespace': 2, // 禁止不规则空格（如全角空格，避免解析错误）
            'no-iterator': 2, // 禁止用__iterator__（非标准属性，用for...of替代）
            'no-label-var': 2, // 禁止标签与变量同名（如label: var label禁止）
            'no-labels': [2, { allowLoop: false, allowSwitch: false }], // 禁止标签语句（如label: for() {}禁止）
            'no-lone-blocks': 2, // 禁止孤立代码块（如{ ... }无意义时禁止）
            'no-mixed-spaces-and-tabs': 2, // 禁止混合空格和Tab缩进（统一缩进方式）
            'no-multi-spaces': 2, // 禁止无意义多余空格（如a  b禁止，应为a b）
            'no-multi-str': 2, // 禁止用\换行的多行字符串（用模板字符串``替代）
            'no-multiple-empty-lines': [2, { max: 1 }], // 最多允许1个连续空行（避免代码松散）
            'no-native-reassign': 2, // 禁止修改原生对象（如Math = {}禁止）
            'no-negated-in-lhs': 2, // 禁止in左侧否定（如!a in b禁止，应为!(a in b)）
            'no-new-object': 2, // 禁止用new Object()（用{}替代）
            'no-new-require': 2, // 禁止new require('mod')（应为const mod = require('mod')）
            'no-new-symbol': 2, // 禁止new Symbol()（Symbol是函数，直接调用Symbol()）
            'no-new-wrappers': 2, // 禁止new String/Number/Boolean（用原始类型替代，如'abc'而非new String('abc')）
            'no-obj-calls': 2, // 禁止调用非函数对象（如const a={}; a()禁止）
            'no-octal': 2, // 禁止0开头八进制（如012禁止，用0o12替代）
            'no-octal-escape': 2, // 禁止字符串八进制转义（如'\012'禁止，用'\n'替代）
            'no-path-concat': 2, // 禁止用__dirname + '/path'（用path.join(__dirname, 'path')避免跨系统问题）
            'no-proto': 2, // 禁止用__proto__（用Object.getPrototypeOf(obj)替代）
            'no-redeclare': 2, // 禁止同一作用域重复声明变量（如var a; var a禁止）
            'no-regex-spaces': 2, // 禁止正则多余空格（如/a  b/禁止，应为/a\s+b/）
            'no-return-assign': [2, 'except-parens'], // 禁止return中赋值（如return a=1禁止，应为a=1; return a）
            'no-self-assign': 2, // 禁止自赋值（如a=a禁止，无意义）
            'no-self-compare': 2, // 禁止自比较（如a===a禁止，无意义）
            'no-sequences': 2, // 禁止逗号表达式（如a,b禁止，应为单独语句）
            'no-shadow-restricted-names': 2, // 禁止覆盖关键字（如var undefined=1禁止）
            'no-spaced-func': 2, // 禁止函数调用括号前空格（如fn ()禁止，应为fn()）
            'no-sparse-arrays': 2, // 禁止稀疏数组（如[1,,3]禁止，应为[1,undefined,3]）
            'no-this-before-super': 2, // 子类构造函数super()前禁止用this（ES6类规范）
            'no-throw-literal': 2, // 禁止throw非Error对象（如throw 'err'禁止，应为throw new Error('err')）
            'no-trailing-spaces': 2, // 禁止行尾多余空格（避免Git提交无意义差异）
            'no-undef': 2, // 禁止使用未定义变量（避免拼写错误，如console.log(usre)禁止）
            'no-undef-init': 2, // 禁止用var a=undefined（应为var a;或let a:string|undefined）
            'no-unexpected-multiline': 2, // 禁止因括号缺失导致的意外多行（如function fn() { return 1禁止，需补分号return 1; }）
            'no-unmodified-loop-condition': 2, // 禁止循环条件不变（如for(let i=0;;i++)禁止，避免死循环）
            'no-unneeded-ternary': [2, { defaultAssignment: false }], // 禁止可简化的三元表达式（如a?a:b禁止，应为a||b）
            'no-unreachable': 2, // 禁止不可达代码（如return后的代码禁止）
            'no-unsafe-finally': 2, // 禁止finally中修改return值（如try{return 1}finally{return 2}禁止）
            'no-unused-vars': [2, { vars: 'all', args: 'none' }], // 禁止未使用变量（检查所有变量，忽略函数参数）
            'no-useless-call': 2, // 禁止多余call()（如fn.call(this,a)可简化为fn(a)时禁止）
            'no-useless-computed-key': 2, // 禁止多余计算属性（如{['a']:1}禁止，应为{a:1}）
            'no-useless-constructor': 2, // 禁止多余构造函数（如class A { constructor() {} }禁止）
            'no-useless-escape': 0, // 允许多余转义字符（如'\''允许，无需改为"'"）
            'no-whitespace-before-property': 2, // 禁止属性前空格（如obj .prop禁止，应为obj.prop）
            'no-with': 2, // 禁止with语句（避免作用域混乱）
            'one-var': [2, { initialized: 'never' }], // 禁止同一var声明多个变量（如var a=1,b=2禁止，需分开声明）
            'operator-linebreak': [2, 'after', { overrides: { '?': 'before', ':': 'before' } }], // 运算符后换行，?/:前换行（如a + b换行在+后，a?b:c换行在?/:前）
            'padded-blocks': [2, 'never'], // 禁止代码块内多余空格（如function() { \n  \n a() }禁止）
            quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }], // 字符串用单引号，允许转义例外（如'it\'s'）和模板字符串（``）
            semi: [2, 'never'], // 禁止语句结尾加分号（如const a=1而非const a=1;）
            'semi-spacing': [2, { before: false, after: true }], // 分号前无空格、后有空格（如for(let i=0; i<10; i++)）
            'space-before-blocks': [2, 'always'], // 代码块{前必须有空格（如if() {而非if(){）
            'space-before-function-paren': [2, 'never'], // 函数括号前无空格（如fn()而非fn ()）
            'space-in-parens': [2, 'never'], // 括号内无空格（如fn(a)而非fn( a )）
            'space-infix-ops': 2, // 中缀运算符（+/-）前后必须有空格（如a + b而非a+b）
            'space-unary-ops': [2, { words: true, nonwords: false }], // 单词类运算符（typeof）前后有空格，符号类（!）无空格（如typeof a，!a）
            'spaced-comment': [
                2,
                'always',
                { markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ','] }
            ], // 注释///*后必须有空格（如// 注释而非//注释）
            'template-curly-spacing': [2, 'never'], // 模板字符串${}内无空格（如`${a}`而非`${ a }`）
            'use-isnan': 2, // 禁止用a==NaN，必须用isNaN(a)（NaN !== NaN）
            'valid-typeof': 2, // 强制typeof结果正确（如typeof a === 'string'而非typeof a === 'str'）
            'wrap-iife': [2, 'any'], // 立即执行函数必须用括号包裹（如(function() {})()而非function() {}()）
            'yield-star-spacing': [2, 'both'], // yield*前后必须有空格（如yield* gen()）
            yoda: [2, 'never'], // 禁止Yoda条件（如if(1===a)禁止，应为if(a===1)）
            'prefer-const': 2, // 优先用const声明不修改的变量（避免意外修改，如const a=1而非let a=1）
            'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // 生产环境禁止debugger（2=报错），开发环境允许（0=关闭检查）
            'object-curly-spacing': [2, 'always', { objectsInObjects: false }], // 对象{}前后有空格，对象内嵌套对象无额外空格（如{ a: { b:1 } }）
            'array-bracket-spacing': [2, 'never'] // 数组[]内无空格（如[1,2]而非[ 1,2 ]）
        }
    },
    eslintConfigPrettier,
    // 这是给 .vue 文件单独 “开权限”
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser
            }
        },

        rules: {
            // checkVueFilename,
            // 开发环境允许使用console，生产环境禁止使用console
            'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
            'vue/multi-word-component-names': [
                'error',
                {
                    ignores: ['Index']
                }
            ],
            'vue/component-definition-name-casing': ['error', 'PascalCase'], // 意思是组件的名称必须是大驼峰命名,这个要在组件内部写defineOptions 才会生效
            'vue/component-name-in-template-casing': ['error', 'PascalCase'], // 意思是模板中的组件名称必须是大驼峰命名
            '@typescript-eslint/no-inferrable-types': 'error',
            '@typescript-eslint/no-var-requires': 'error'
        }
    },

    // 每个模块下面允许有一个Index.vue文件，但是不允许有其他的.vue文件，
    {
        name: 'vue/index-file',
        files: ['**/Index.vue'],
        rules: {
            'vue/multi-word-component-names': 'off' // 意思是允许Index.vue文件的组件名称是多单词的，但是其他的.vue文件的组件名称必须是单词的
        }
    },

    // 每个配置对象都包含 ESLint 需要在一组文件上执行的所有信息。每个配置对象都由以下属性组成：
    // 下面是给 .cjs 类型的 Node 脚本单独 “开权限”
    // 配置块8：Node.js CJS文件专项配置（适配CJS规范，符合ESLint v9规范）
    {
        name: 'node/cjs-config', // 配置名称：明确为Node CJS文件的配置
        files: ['**/*.cjs', '**/*.mjs', '**/*.config.js', '**/*.config.ts'], // 作用于CJS文件（如utils.cjs）和工具配置文件（如vite.config.js）
        languageOptions: {
            globals: { ...globals.node } // 启用Node全局变量（如require/process）
        },
        rules: {
            'no-console': 'off', // 允许CJS文件用console（如配置文件打印日志）
            '@typescript-eslint/no-require-imports': 'off' // 允许CJS文件用require（CJS规范必须，覆盖TS规则）
        }
    },

    // 配置块9：TypeScript文件专项配置（强化TS代码质量，符合ESLint v9规范）
    {
        name: 'typescript/ts-file-config', // 配置名称：明确为TS文件的强化配置
        files: ['**/*.{ts,mts,cts}'], // 仅作用于TS相关文件（.ts/.mts/.cts）
        languageOptions: {
            parser: tseslint.parser, // TS文件主解析器（ESLint v9规范：TS文件需用专用解析器）
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'error', // 禁止TS未使用变量（比JS规则精准，识别TS类型变量）
            '@typescript-eslint/no-explicit-any': 'error', // 禁止显式any类型（强制用具体类型或unknown，避免弱化TS类型系统）
            '@typescript-eslint/no-empty-function': 'error', // 禁止TS空函数（如() => {}，需加注释说明）
            '@typescript-eslint/no-empty-interface': 'error', // 禁止TS空接口（如interface Empty {}，需扩展其他接口）
            '@typescript-eslint/no-non-null-assertion': 'error', // 禁止TS非空断言!（如obj!.prop，避免忽略null/undefined风险）
            '@typescript-eslint/no-unsafe-declaration-merging': 'error', // 禁止TS不安全声明合并（如同时声明interface A和function A）
            'no-use-before-define': 'off', // 关闭JS基础"使用前定义"规则（无法识别TS类型提升）
            '@typescript-eslint/no-use-before-define': 'warn', // 启用TS"使用前定义"规则（支持interface先使用后定义，警告而非报错）
            '@typescript-eslint/no-useless-empty-export': 'error', // 禁止TS无意义空导出（如export {}）
            '@typescript-eslint/prefer-for-of': 'error' // TS优先用for...of循环（替代传统for循环，如for(const item of arr)）
        }
    },

    // 为特定的文件加上node环境
    {
        name: 'node/env',
        files: ['**/auto-config/**', 'pre-commit.js'],
        languageOptions: {
            globals: { ...globals.node }
        }
    }
])

export default {
    '*.vue': [
        'eslint --fix --plugin vue --plugin security',
        'prettier --write',
        'vue-tsc --noEmit --skipLibCheck'
    ],

    '*.ts': () => 'tsc --noEmit --skipLibCheck --strict'
}

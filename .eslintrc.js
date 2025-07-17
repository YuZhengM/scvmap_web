module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  /**
   * 0 或 'off': 关闭规则.
   * 1 或 'warn': 打开规则, 并且作为一个警告, 字体颜色为黄色 (并不会导致检查不通过).
   * 2 或 'error': 打开规则, 并且作为一个错误, 色体颜色为红色 (退出码为 1, 检查不通过).
   */
  rules: {
    // allow console output during development
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 设置注释一行内最多字符为 200 个, 忽略 URL
    'max-len': ['error', {
      comments: 200,
      ignoreUrls: true,
      code: 200
    }],
    // 设置对象中最后一个元素后面是否进行加逗号, 从不加
    'comma-dangle': ['error', 'never'],
    // 大括号引用的内容, 超过 8 进行换行
    'object-curly-newline': ['error', {
      minProperties: 8,
      consistent: true
    }],
    // 允许 i++ 形式
    'no-plusplus': 0,
    // 函数行为参数
    'no-param-reassign': ['error', { props: false }],
    // 由于枚举类型定义一直会被识别为变量内部重复
    'no-shadow': 0,
    // 在用 element ui 中 form 下 rule 检验会出现延迟返回
    'consistent-return': 0,
    // 可以嵌套三目运算
    'no-nested-ternary': 0,
    // 由于需要上传 Git 环境, 故拉取或者切换分支会出现换行符 (LF) Linux 和 Windows (CRLF) 环境不一致问题, 关闭
    'linebreak-style': [0, process.env.NODE_ENV === 'production' ? 'unix' : 'windows'],
    // 下面带有 @typescript-eslint 的全部关闭规则
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
};

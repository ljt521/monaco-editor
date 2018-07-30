import {Component, OnInit, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  options: any;
  code: any;
  _editor: any;
  config: any;

  ngOnInit() {
    this.config = {
      // Set defaultToken to invalid to see what you do not tokenize yet
      // defaultToken: 'invalid',
      keyword: [
        'ABSTRACT', 'CONTINUE', 'FOR', 'NEW', 'SWITCH', 'ASSERT', 'GOTO', 'DO',
        'IF', 'PRIVATE', 'THIS', 'BREAK', 'PROTECTED', 'THROW', 'ELSE', 'PUBLIC',
        'ENUM', 'RETURN', 'CATCH', 'TRY', 'INTERFACE', 'STATIC', 'CLASS',
        'FINALLY', 'CONST', 'SUPER', 'WHILE', 'TRUE', 'FALSE', 'END', 'TESK', 'FUNCTION'
      ],

      type: [
        'BOOLEAN', 'DOUBLE', 'BYTE', 'INT', 'SHORT', 'CHAR', 'VOID', 'LONG', 'FLOAT'
      ],
      tag: ['ML', 'MP', 'SetOne', 'REL', 'MIO', 'WAIT'],
      operators: [
        '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
        '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
        '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
        '%=', '<<=', '>>=', '>>>='
      ],

      // we include these common regular expressions
      symbols: /[=><!~?:&|+\-*\/\^%]+/,

      // C# style strings
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

      // The main tokenizer for our languages
      tokenizer: {
        root: [
          // identifiers and keywords
          [/[A-Z_$][\w$]*/, {
            cases: {
              '@type': 'type',
              '@keyword': 'keyword',
              '@tag': 'tag',
              '@default': 'identifier'
            }
          }],
          [/[A-Z][\w\$]*/, 'type.identifier'],  // to show class names nicely

          // whitespace
          {include: '@whitespace'},

          // delimiters and operators
          [/[{}()\[\]]/, '@brackets'],
          [/[<>](?!@symbols)/, '@brackets'],
          [/@symbols/, {
            cases: {
              '@operators': 'operator',
              '@default': ''
            }
          }],

          // @ annotations.
          // As an example, we emit a debugging log message on these tokens.
          // Note: message are supressed during the first load -- change some lines to see them.
          [/@\s*[a-zA-Z_\$][\w\$]*/, {token: 'annotation', log: 'annotation token: $0'}],

          // numbers
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/0[xX][0-9a-fA-F]+/, 'number.hex'],
          [/\d+/, 'number'],

          // delimiter: after number because of .\d floats
          [/[;,.]/, 'delimiter'],

          // strings
          [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
          [/"/, {token: 'string.quote', bracket: '@open', next: '@string'}],

          // characters
          [/'[^\\']'/, 'string'],
          [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
          [/'/, 'string.invalid']
        ],

        comment: [
          [/[^\/*]+/, 'comment'],
          [/\/\*/, 'comment', '@push'],    // nested comment
          ['\\*/', 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ],

        string: [
          [/[^\\"]+/, 'string'],
          [/@escapes/, 'string.escape'],
          [/\\./, 'string.escape.invalid'],
          [/"/, {token: 'string.quote', bracket: '@close', next: '@pop'}]
        ],

        whitespace: [
          [/[ \t\r\n]+/, 'white'],
          [/\/\*/, 'comment', '@comment'],
          [/\/\/.*$/, 'comment'],
        ],
      },
    };
  }

  ngAfterViewInit() {
  }

  onInit(editor) {
    console.log(editor);
    editor.trigger('随便写点儿啥', 'editor.action.triggerSuggest', {});

    function getCode() {
      return [
        '[Sun Mar 7 16:02:00 2004] [info] Server built: Feb 27 2004 13:56:37',
        '[Sun Mar 7 16:02:00 2004] [notice] Accept mutex: sysvsem (Default: sysvsem)',
        '/* Type source code in \\your language here*/',
        'class a abstract if  double',
        'VAR finishCount = 0\n' +
        '\n' +
        '/* 初始化 */\n' +
        'P1 = [X400 Y0 Z0 RX0]\n' +
        'P2 = [X200 Y200 Z0 RX0]\n' +
        '\n' +
        'ARM = RIGHT\n' +
        'MIO.DO1=OFF\n' +
        'WAIT 0.5\n' +
        'TOOL1 CSYS1 // 选择工具坐标系和参考坐标系\n' +
        '\n' +
        'FOR 100\n' +
        '    MP P1 F100   // 点到点移动到P[1]位置，速度100%\n' +
        '    GetOne          //执行抓取\n' +
        '    MP P2 F100\n' +
        '    SetOne\n' +
        '    IF MIO.DI1==ON                   // 判断是否放置正常\n' +
        '        finishCount = finishCount + 1\n' +
        '        LOG "放置数量:" + finishCount\n' +
        '    ELSE\n' +
        '        ALM "放置出错！"\n' +
        '        PAUSE           // 程序暂停\n' +
        '    END\n' +
        'END\n' +
        '\n' +
        '/* 定义一个抓取的任务 */\n' +
        'TESK GetOne\n' +
        '    ML REL Z-50 V1000 CNT0\n' +
        '    MIO.DO1=ON\n' +
        '    WAIT 0.5\n' +
        '    ML Z50\n' +
        'END\n' +
        '[\'sd\', \'\']' +
        '\n' +
        '/* 定义一个放下的任务 */\n' +
        'TESK SetOne\n' +
        '    ML REL Z-48 V1000 CNT0\n' +
        '    MIO.DO1=ON\n' +
        '    WAIT 0.5\n' +
        '    ML Z48\n' +
        'END\n'
      ].join('\n');
    }

    this._editor = editor;
    // Register a new language
    monaco.languages.register({id: 'mySpecialLanguage'});

// Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider('mySpecialLanguage', this.config);

// Define a new theme that constains only rules that match this language
    const setOp: any = {
      base: 'vs',
      inherit: true,
      rules: [
        {token: 'custom-info', foreground: '808080'},
        {token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold'},
        {token: 'custom-notice', foreground: 'FFA500'},
        {token: 'custom-date', foreground: '008800'},
        {token: 'number', foreground: '000000'},
        {token: 'keyword', foreground: '9976ab'},
        {token: 'type', foreground: 'cd7831'},
        {token: 'string', foreground: '008000'},
        {token: 'string.escape', foreground: '008000'},
        {token: 'comment', foreground: '008000'},
        {token: 'teg', foreground: '9976ab'},
        {token: 'delimiter', foreground: '9976ab'},
      ]
    };
    monaco.editor.defineTheme('myCoolTheme', setOp);

// Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider('mySpecialLanguage', {
      provideCompletionItems: () => {
        return [
          {
            label: 'P1',
            kind: monaco.languages.CompletionItemKind.Text
          }, {
            label: 'FUNCTION',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: {
              value: ['FUNCTION(${1:E}) {',
                  '',
                '}'].join('\n')
            }
          },
          {
            label: 'IFELSE',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: {
              value: [
                'IF (${1:BOOLE}) {',
                '\t$0',
                '} ELSE {',
                '\t',
                '}'
              ].join('\n')
            },
            documentation: 'If-Else Statement'
          }
        ];
      }
    });
    /*获取位置*/
    const line = editor.getPosition();
    const range = new monaco.Range(line.lineNumber, 1, line.lineNumber, 1);
    const id = {major: 1, minor: 1};
    const text = getCode();
    const op = {identifier: id, range: range, text: text, forceMoveMarkers: true};
    editor.executeEdits('source', [op]);
    const model = editor.getModel(this._editor);
    monaco.editor.setModelLanguage(model, 'mySpecialLanguage');
    monaco.editor.setTheme('myCoolTheme');
    this.onChange();
  }

  onChange() {
    this._editor.onDidChangeModelContent((e) => {
    });
  }

}

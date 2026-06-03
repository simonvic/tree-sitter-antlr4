/**
 * @file Antlr4 grammar for tree-sitter
 * @author simonvic <simonvic.dev@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "antlr4",

  extras: $ => [
    /\s/, // whitespaces do matters, but whatever
    $.comment_line,
    $.comment_block,
  ],

  conflicts: $ => [
    [$.predicate_option, $.element_option],
  ],

  rules: {

    grammar_spec: $ => seq(
      $.grammar_decl,
      repeat($.prequel_construct),
      repeat($.rule_spec),
      repeat($.mode_spec),
    ),

    grammar_decl: $ => seq(
      $.grammar_type,
      $.identifier,
      ';',
    ),

    grammar_type: $ => seq(optional(choice('lexer', 'parser')), 'grammar'),

    prequel_construct: $ => choice(
      $.options_spec,
      $.delegate_grammars,
      $.tokens_spec,
      $.channels_spec,
      $.action,
    ),

    ////////////////////////////////////////////////////////////////////////////
    // Options

    options_spec: $ => seq('options', '{', repeat(seq($.option, ';')), '}'),

    option: $ => seq($.identifier, '=', $.option_value),

    option_value: $ => choice(
      seq($.identifier, repeat(seq('.', $.identifier))),
      $.literal_string,
      $._action,
      $.literal_int,
    ),

    ////////////////////////////////////////////////////////////////////////////
    // Delegates

    delegate_grammars: $ => seq(
      'import',
      $.delegate_grammar,
      repeat(seq(',', $.delegate_grammar)),
      ';',
    ),

    delegate_grammar: $ => seq(
      $.identifier,
      optional(seq('=', $.identifier)),
    ),

    ////////////////////////////////////////////////////////////////////////////
    // Tokens and Channels

    tokens_spec: $ => seq('tokens', '{', optional($.identifiers_list), '}'),
    channels_spec: $ => seq('channels', '{', optional($.identifiers_list), '}'),

    identifiers_list: $ => seq($.identifier, repeat(seq(',', $.identifier)), optional(',')),

    action: $ => seq(
      '@',
      optional(seq($.action_scope_name, '::')),
      $.identifier,
      $._action,
    ),

    action_scope_name: $ => choice($.identifier, 'lexer', 'paser'),

    _action: $ => seq(
      '{',
      repeat(choice(
        $._action,
        $.literal_string,
        $.literal_string_double,
        $.literal_string_triple,
        $.literal_string_backtick,
        $.escape_sequence,
      )),
      '}',
    ),

    mode_spec: $ => seq('mode', $.identifier, ';', repeat($.rule_spec_lexer)),

    rule_spec: $ => choice(
      $.rule_spec_parser,
      $.rule_spec_lexer,
    ),

    rule_spec_parser: $ => seq(
      optional($.rule_modifier),
      $.rule_ref,
      optional($.arg_action_block),
      optional($.rule_returns),
      optional($.throws_spec),
      optional($.locals_spec),
      repeat($.rule_prequel),
      ':',
      $.rule_block,
      ';',
      optional($.exception_group),
    ),

    exception_group: $ => seq(repeat1($.exception_handler), optional($.finally_clause)),

    exception_handler: $ => seq('catch', $.arg_action_block, $._action),

    finally_clause: $ => seq('finally', $._action),

    rule_prequel: $ => choice($.options_spec, $.rule_action),

    rule_returns: $ => seq('returns', $.arg_action_block),

    throws_spec: $ => seq('throws', $.qualified_identifier, repeat(seq(',', $.qualified_identifier))),

    locals_spec: $ => seq('locals', $.arg_action_block),

    rule_action: $ => seq('@', $.identifier, $._action),

    rule_modifiers: $ => repeat1($.rule_modifier),

    rule_modifier: _ => choice(
      'public',
      'private',
      'protected',
      'fragment',
    ),

    rule_block: $ => seq($.rule_alt_list),

    rule_alt_list: $ => seq($.labeled_alt, repeat(seq('|', $.labeled_alt))),

    labeled_alt: $ => seq($.alternative, optional(seq('#', $.identifier))),

    ////////////////////////////////////////////////////////////////////////////
    // Lexer

    rule_spec_lexer: $ => seq(
      optional('fragment'),
      $.token_ref,
      optional($.options_spec),
      ':',
      $.lexer_rule_block,
      ';',
    ),

    lexer_rule_block: $ => seq($.lexer_alt_list),

    lexer_alt_list: $ => seq($.lexer_alt, repeat(seq('|', $.lexer_alt))),

    lexer_alt: $ => seq($.lexer_elements, optional($.lexer_commands)),

    lexer_elements: $ => repeat1($.lexer_element), // TODO: allow empty alts

    lexer_element: $ => choice(
      seq(choice($.lexer_atom, $.lexer_block), optional($.ebnf_suffix)),
      seq($._action, optional('?')),
    ),

    lexer_block: $ => seq('(', $.lexer_alt_list, ')'),

    lexer_commands: $ => seq('->', $.lexer_command, repeat(seq(',', $.lexer_command))),

    lexer_command: $ => seq($.lexer_command_name, optional(seq('(', $.lexer_command_expr, ')'))),

    lexer_command_name: $ => choice($.identifier, 'mode'),

    lexer_command_expr: $ => choice($.identifier, $.literal_int),

    ////////////////////////////////////////////////////////////////////////////
    // Rule alts

    alt_list: $ => seq($.alternative, repeat(seq('|', $.alternative))),

    alternative: $ => seq(optional($.element_options), repeat1($.element)),

    element: $ => choice(
      seq(choice($.labeled_element, $.atom), optional($.ebnf_suffix)), // TODO: check this
      $.ebnf,
      seq($._action, optional('?'), optional($.predicate_options)),
    ),

    predicate_options: $ => seq('<', $.predicate_option, repeat(seq(',', $.predicate_option)), '>'),

    predicate_option: $ => choice(
      $.element_option,
      seq($.identifier, '=', choice($._action, $.literal_int, $.literal_string)),
    ),

    labeled_element: $ => seq($.identifier, choice('=', '+='), choice($.atom, $.block)),

    ////////////////////////////////////////////////////////////////////////////
    // EBNF and blocks

    ebnf: $ => seq($.block, optional($.ebnf_suffix)),

    ebnf_suffix: _ => seq(
      choice('?', '*', '+'),
      optional('?'),
    ),

    lexer_atom: $ => choice(
      $.character_range,
      $.terminal_def,
      $.not_set,
      $.lexer_char_set,
      $.wildcard,
    ),

    atom: $ => choice(
      $.terminal_def,
      $.rule_ref,
      $.not_set,
      $.wildcard,
    ),

    wildcard: $ => seq('.', optional($.element_options)),

    not_set: $ => seq('~', choice($.set_element, $.block_set)),

    block_set: $ => seq('(', $.set_element, repeat(seq('|', $.set_element)), ')'),

    set_element: $ => choice(
      seq(choice($.token_ref, $.literal_string), optional($.element_options)),
      $.character_range,
      $.lexer_char_set,
    ),

    block: $ => seq(
      '(',
      optional(seq(optional($.options_spec), repeat($.rule_action), ':')),
      $.alt_list,
      ')',
    ),

    character_range: $ => seq($.literal_string, '..', $.literal_string),

    terminal_def: $ => seq(choice($.token_ref, $.literal_string), optional($.element_options)),

    element_options: $ => seq('<', $.element_option, repeat(seq(',', $.element_option)), '>'),

    element_option: $ => choice(
      $.qualified_identifier,
      seq($.identifier, '=', choice($.qualified_identifier, $.literal_string, $.literal_int))
    ),

    ////////////////////////////////////////////////////////////////////////////

    qualified_identifier: $ => seq($.identifier, repeat(seq('.', $.identifier))),

    identifier: $ => choice(
      $.rule_ref,
      $.token_ref,
    ),

    literal_string: $ => seq(
      '\'',
      repeat(choice(
        /[^'\\]/,
        $.string_escape_sequence,
      )),
      '\'',
    ),

    literal_string_double: $ => seq(
      '"',
      repeat(choice(
        /[^"\r\n\\]/,
        $.string_escape_sequence,
      )),
      '"',
    ),

    literal_string_backtick: $ => seq(
      '`',
      repeat(choice(
        /[^`\r\n\\]/,
        $.string_escape_sequence,
      )),
      '`',
    ),

    literal_string_triple: $ => seq(
      '"""',
      repeat(choice(
        /[^\\]/,
        $.string_escape_sequence,
      )),
      '"""',
    ),

    string_escape_sequence: _ => token.immediate(choice(
      seq('\\', /\\[nrtbf"'\\>]/),
      seq('\\u', /[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]/),
    )),

    literal_int: _ => token(/[0-9]+/),

    rule_ref: _ => token(/[A-Z][A-Za-z0-9_]*/),
    token_ref: _ => token(/[a-z][A-Za-z0-9_]*/),

    escape_sequence: _ => token(/\\./),

    arg_action_block: _ => token(/\[.*\]/),

    lexer_char_set: _ => token(/\[\]/), // TODO: complete

    comment_line: _ => token(prec(0, seq('//', /[^\n]*/))),

    // kindly borrowed from https://github.com/tree-sitter/tree-sitter-java/blob/master/grammar.js#L1291C5-L1297C8
    comment_block: _ => token(prec(0, seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/',
    ))),

  }

});

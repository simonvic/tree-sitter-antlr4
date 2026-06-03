[
  (comment_line)
  (comment_block)
] @comment.outer

(literal_int) @number.inner

(grammar_decl
  (identifier) @class.inner) @class.outer

(rule_spec_lexer
  (lexer_rule_block) @function.inner) @function.outer

(lexer_alt_list
  "|"? @parameter.outer
  .
  (_) @parameter.inner @parameter.outer)

(rule_spec_parser
  (rule_block) @function.inner) @function.outer

(rule_alt_list
  "|"? @parameter.outer
  .
  (_) @parameter.inner @parameter.outer)

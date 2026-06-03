(grammar_spec
  (grammar_decl
    (identifier) @name)
  (#set! "kind" "Class")) @symbol

(rule_spec_parser
  (rule_ref) @name
  (#set! "kind" "Function")) @symbol

(rule_spec_lexer
  (token_ref) @name
  (#set! "kind" "Function")) @symbol

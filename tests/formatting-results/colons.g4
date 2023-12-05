grammar Colons;

// $antlr-format alignColons hanging, allowShortBlocksOnASingleLine off

start: (: COMMA | DOT) | DOT;

// $antlr-format alignColons hanging, allowShortBlocksOnASingleLine off, allowShortRulesOnASingleLine off

end
	: (
		: COMMA
		| DOT
	)
	| DOT
;

DOT
	: '.'
;

COMMA
	: ','
;
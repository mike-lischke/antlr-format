// $antlr-format alignTrailingComments true, columnLimit 150, minEmptyLines 1, maxEmptyLinesToKeep 1, reflowComments false, useTab false
// $antlr-format allowShortRulesOnASingleLine false, allowShortBlocksOnASingleLine true, alignSemicolons hanging, alignColons hanging

grammar RuleOptions;

options {
    caseInsensitive = true;
}


fragment ULCorner_f options {
        caseInsensitive = false;
    }
    : '\u231C';

ULCorner
    : ULCorner_f
    ;

fragment URCorner_f options {
        caseInsensitive = false;
    }
    : '\u231D';


fragment HtmlNameStartChar options {
    caseInsensitive = false;
}:
    [:a-zA-Z]
    | '\u2070' ..'\u218F'
    | '\u2C00' ..'\u2FEF'
    | '\u3001' ..'\uD7FF'
    | '\uF900' ..'\uFDCF'
    | '\uFDF0' ..'\uFFFD';
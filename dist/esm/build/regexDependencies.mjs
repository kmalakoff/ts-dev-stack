module.exports = function regexDependencies(esm) {
    const matchingDeps = '\\s*[\'"`]([^\'"`]+)[\'"`]\\s*';
    const matchingName = '\\s*(?:[\\w${},\\s*]+)\\s*';
    let regex = `(?:(?:var|const|let)${matchingName}=\\s*)?require\\(${matchingDeps}\\);?`;
    if (esm) {
        regex += `|import(?:${matchingName}from\\s*)?${matchingDeps};?`;
        regex += `|export(?:${matchingName}from\\s*)?${matchingDeps};?`;
    }
    return new RegExp(regex, 'g');
};

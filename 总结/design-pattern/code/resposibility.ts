interface IFilter {
    doFilter(req, res, chain);
}

interface FilterChain {
    doFilter(req, res);
}

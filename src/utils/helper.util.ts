function getOffset(currentPage = 1, listPerPage:number) {
    return (currentPage - 1) * listPerPage;
}

function emptyOrRows(rows: any) {
    if (!rows) {
        return [];
    }
    return rows;
}

module.exports = {
    getOffset,
    emptyOrRows
}
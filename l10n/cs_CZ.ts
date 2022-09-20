export default {
    search: {
        placeholder: 'Napište klíčové slovo...',
    },
    sort: {
        sortAsc: 'Seřadit sloupec vzestupně',
        sortDesc: 'Seřadit sloupec sestupně',
    },
    pagination: {
        previous: 'Předchozí',
        next: 'Další',
        navigate: (page, pages) => `Stránka ${page} z ${pages}`,
        page: (page) => `Stránka ${page}`,
        showing: 'Zobrazeno',
        of: 'z',
        to: 'až',
        results: 'výsledků',
    },
    loading: 'Načítám...',
    noRecordsFound: 'Nebyly nalezeny žádné odpovídající záznamy',
    error: 'Při načítání dat došlo k chybě',
};

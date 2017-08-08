module.exports = {
    entry: './main', //входной файл
    output: {
        filename: 'build.js',
        library: 'main'
    },
    watch: true, //Отслеживание изменений в файлах
    //Опции пересборки
    watchOptions: {
        aggregateTimeout: 100 //100мс, по умолчанию 300мс
    },
    devtool: 'inline-source-map'
};
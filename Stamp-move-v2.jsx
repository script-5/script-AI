// 1 см в пунктах
var CM_TO_PT = 28.3464567;

if (app.documents.length > 0) {
    var doc = app.activeDocument;

    if (doc.selection.length > 0) {
        var sel = doc.selection[0]; // первый выделенный объект

        // Получаем размеры артборда (берём активный)
        var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
        var abRect = artboard.artboardRect; 
        // abRect: [left, top, right, bottom] в пунктах

        var left = abRect[0];
        var bottom = abRect[3];

        // Отступ от низа
        var offsetY = -10 * CM_TO_PT;

        // Новая позиция: X = левый край артборда, Y = bottom + offsetY
        // В Illustrator position = [X, Y], где Y — верх объекта!
        sel.position = [left, bottom + offsetY + sel.height];

    } else {
        // alert("Нет выделенного объекта.");
    }
}
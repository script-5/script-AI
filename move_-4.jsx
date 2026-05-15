// ExtendScript для Adobe Illustrator 23.0.5
// Размещение объекта на расстоянии 4 мм от левого края артборда
(function main() {
    // Проверка наличия открытого документа
    if (app.documents.length === 0) {
        alert("Пожалуйста, откройте документ.");
        return;
    }

    var doc = app.activeDocument;
    var sel = doc.selection;

    // Проверка наличия выделения
    if (sel === null || sel.length === 0) {
        alert("Пожалуйста, выделите один или несколько объектов.");
        return;
    }

    var mm = 2.834645; // Конвертация 1 мм в пункты (pt)
    var offsetFromLeftEdge = -4 * mm; // Целевое смещение (-4 мм) от левого края артборда

    // 1. Получаем границы текущего артборда [left, top, right, bottom]
    var abIdx = doc.artboards.getActiveArtboardIndex();
    var abRect = doc.artboards[abIdx].artboardRect;
    
    var abLeft = abRect[0];
    var abTop = abRect[1];
    var abBottom = abRect[3];

    // Вычисляем центр артборда по оси Y
    var abMidY = (abTop + abBottom) / 2;

    // 2. Вычисляем общие геометрические границы для всех выделенных объектов
    // Это нужно, если выделена группа или несколько объектов, чтобы переместить их как единое целое.
    var totalBounds = sel[0].geometricBounds; // [L, T, R, B]
    for (var i = 1; i < sel.length; i++) {
        var b = sel[i].geometricBounds;
        if (b[0] < totalBounds[0]) totalBounds[0] = b[0]; // Самый левый край
        if (b[1] > totalBounds[1]) totalBounds[1] = b[1]; // Самый верхний край (макс Y)
        if (b[2] > totalBounds[2]) totalBounds[2] = b[2]; // Самый правый край
        if (b[3] < totalBounds[3]) totalBounds[3] = b[3]; // Самый нижний край (мин Y)
    }

    // Текущие координаты выделения
    var currentRight = totalBounds[2]; // Правый край выделения
    var currentMidY = (totalBounds[1] + totalBounds[3]) / 2; // Центр выделения по Y

    // 3. Расчет целевых координат и смещения (Delta)
    // Целевая позиция правого края объекта по X = (Левый край артборда) + (-5 мм)
    var targetRightX = abLeft + offsetFromLeftEdge; // Или abLeft - (5 * mm)

    // Целевая позиция центра объекта по Y = Центр артборда по Y
    var targetMidY = abMidY;

    // Смещение по X = Целевой правый край - Текущий правый край
    var deltaX = targetRightX - currentRight;
    
    // Смещение по Y = Целевой центр Y - Текущий центр Y
    var deltaY = targetMidY - currentMidY;

    // 4. Перемещение каждого выделенного объекта
    // Illustrator перемещает объекты относительно их текущего положения
    for (var j = 0; j < sel.length; j++) {
        sel[j].translate(deltaX, deltaY);
    }

    // 5. Снять выделение со всех объектов
    doc.selection = null;

})();

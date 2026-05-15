// ExtendScript для Adobe Illustrator 23.0.5 Создание приводных точек для пакета
(function main() {
    if (app.documents.length === 0) {
        alert("Нет открытого документа");
        return;
    }

    var doc = app.activeDocument;
    var mm = 2.834645; // Конвертация 1 мм в пункты (pt)

    // 1. Создание или выбор слоя "DotPacket"
    var layerName = "•DotPacket";
    var dotLayer;
    try {
        dotLayer = doc.layers.getByName(layerName);
    } catch (e) {
        dotLayer = doc.layers.add();
        dotLayer.name = layerName;
    }
    doc.activeLayer = dotLayer;

    // Определение цветов
    var whiteColor = new CMYKColor();
    whiteColor.cyan = 0; whiteColor.magenta = 0; whiteColor.yellow = 0; whiteColor.black = 0;

    var regColor;
    try {
        regColor = doc.swatches.getByName("[Registration]").color;
    } catch (e) {
        regColor = new CMYKColor();
        regColor.cyan = 100; regColor.magenta = 100; regColor.yellow = 100; regColor.black = 100;
    }

    // Координаты активного артборда [left, top, right, bottom]
    var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()].artboardRect;
    var L = ab[0]; // Лево
    var T = ab[1]; // Верх
    var R = ab[2]; // Право
    var B = ab[3]; // Низ
    
    var midX = (L + R) / 2;
    var midY = (T + B) / 2;

    /**
     * Функция создания группы из двух кругов
     */
    function createDotPacket(cX, cY) {
        var group = dotLayer.groupItems.add();
        
        var d1 = 0.695 * mm;
        var d2 = 0.295 * mm;

        // Круг 1: Белый (0.695 мм)
        var circle1 = group.pathItems.ellipse(cY + (d1 / 2), cX - (d1 / 2), d1, d1);
        circle1.fillColor = whiteColor;
        circle1.stroked = false;
        circle1.fillOverprint = false;
        circle1.strokeOverprint = false;

        // Круг 2: Registration (0.295 мм)
        var circle2 = group.pathItems.ellipse(cY + (d2 / 2), cX - (d2 / 2), d2, d2);
        circle2.fillColor = regColor;
        circle2.stroked = false;
        circle2.fillOverprint = false;
        circle2.strokeOverprint = false;

        return group;
    }

    // --- Создание объектов ---

    // 1. Верхний левый: Y -2 мм (вниз), X -1 мм (влево)
    createDotPacket(L - (2 * mm), T - (1 * mm));

    // 2. Центр Y, Левый край: X -1 мм (влево)
    createDotPacket(L - (2 * mm), midY);

    // 3. Нижний левый: Y +2 мм (вверх), X -1 мм (влево)
    createDotPacket(L - (2 * mm), B + (1 * mm));

    // 4. Правый нижний: Y +2 мм (вверх), X +1 мм (вправо)
    createDotPacket(R + (2 * mm), B + (1 * mm));

    // 5. Центр Y, Правый край: X +1 мм (вправо)
    createDotPacket(R + (2 * mm), midY);

    // 6. Верхний правый: Y -2 мм (вниз), X +1 мм (вправо)
    createDotPacket(R + (2 * mm), T - (1 * mm));

    // 7. Центр артборда (Объект 7)
    var obj7 = createDotPacket(midX, midY);

    // --- Выделение ---
    doc.selection = null; // Снимаем выделение со всех объектов в документе
    obj7.selected = true; // Выделяем только последний созданный объект (№7)

})();

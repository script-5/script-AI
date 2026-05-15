// скрипт "точки Гигиена № 3" создает приводные точки диметром 0,3 мм. Цвет Registration.
// позиционирование:
//
//верхние точки - 1 от верхнего края Артборда и -2 мм от края Артборда
//средние точки - по центру Артборда и -2 мм от края Артборда

#target illustrator

(function () {
    var doc = app.activeDocument;

    // --- Проверка и создание слоя •DotHygiene ---
    var layer;
    try {
        layer = doc.layers.getByName("•DotHygiene");
    } catch (e) {
        layer = doc.layers.add();
        layer.name = "•DotHygiene";
    }
    doc.activeLayer = layer;

    // --- Настройки ---
    var mm = 2.834645; // 1 мм в pt

    var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var rect = ab.artboardRect;
    // [left, top, right, bottom]
    var left   = rect[0];
    var top    = rect[1];
    var right  = rect[2];
    var bottom = rect[3];
    var centerX = (left + right) / 2;
    var centerY = (top + bottom) / 2;

    // Цвет Registration
    var regColor = doc.swatches["[Registration]"].color;

    // --- Функция для создания приводной точки ---
    function makeCircle(cx, cy, diameter, fill) {
        var radius = diameter / 2;
        var circle = layer.pathItems.ellipse(
            cy + radius, // top
            cx - radius, // left
            diameter,    // width
            diameter     // height
        );
        circle.filled = true;
        circle.fillColor = fill;
        circle.stroked = false;
        circle.overprintFill = false;
        circle.overprintStroke = false;
        return circle;
    }

    // === Точки 7–12 (Registration, 0.3 мм) ===
    makeCircle(left  - 2*mm, top    - 1*mm,    0.295*mm, regColor); // 1
    makeCircle(left  - 2*mm, centerY,          0.295*mm, regColor); // 2
    makeCircle(left  - 2*mm, bottom + 1*mm,    0.295*mm, regColor); // 3
    makeCircle(right + 2*mm, bottom + 1*mm,    0.295*mm, regColor); // 4
    makeCircle(right + 2*mm, centerY,          0.295*mm, regColor); // 5
    makeCircle(right + 2*mm, top    - 1*mm,    0.295*mm, regColor); // 6

    //alert("Приводные элементы созданы."); //отключил сообщение
})();
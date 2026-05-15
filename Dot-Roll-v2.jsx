// скрипт "точки Рулонка №2" создает приводные точки диметром 0,3 мм. Цвет Registration.
// позади всех точек создаются объекты "белого" цвета диаметром 0,7 мм
// позиционирование:
//верхние точки - 1 от верхнего края Артборда и 2 мм от края Артборда
//средние точки - по центру Артборда и 2 мм от края Артборда

#target illustrator

(function () {
    var doc = app.activeDocument;

    // --- Проверка и создание слоя •DotsRoll ---
    var layer;
    try {
        layer = doc.layers.getByName("•DotsRoll");
    } catch (e) {
        layer = doc.layers.add();
        layer.name = "•DotsRoll";
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

    // Цвет белый (C0M0Y0K0)
    var whiteColor = new CMYKColor();
    whiteColor.cyan = 0;
    whiteColor.magenta = 0;
    whiteColor.yellow = 0;
    whiteColor.black = 0;

    // Цвет Registration
    var regColor = doc.swatches["[Registration]"].color;

    // --- Функция для создания круга ---
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

    // === Точки/подложка 1–6 (белые, 0.7 мм) ===
    makeCircle(left  + 2*mm, top    - 1*mm,    0.695*mm, whiteColor); // 1
    makeCircle(left  + 2*mm, centerY,          0.695*mm, whiteColor); // 2
    makeCircle(left  + 2*mm, bottom + 1*mm,    0.695*mm, whiteColor); // 3
    makeCircle(right - 2*mm, bottom + 1*mm,    0.695*mm, whiteColor); // 4
    makeCircle(right - 2*mm, centerY,          0.695*mm, whiteColor); // 5
    makeCircle(right - 2*mm, top    - 1*mm,    0.695*mm, whiteColor); // 6

    // === Точки 7–12 (Registration, 0.3 мм) ===
    makeCircle(left  + 2*mm, top    - 1*mm,    0.295*mm, regColor); // 7
    makeCircle(left  + 2*mm, centerY,          0.295*mm, regColor); // 8
    makeCircle(left  + 2*mm, bottom + 1*mm,    0.295*mm, regColor); // 9
    makeCircle(right - 2*mm, bottom + 1*mm,    0.295*mm, regColor); // 10
    makeCircle(right - 2*mm, centerY,          0.295*mm, regColor); // 11
    makeCircle(right - 2*mm, top    - 1*mm,    0.295*mm, regColor); // 12

    //alert("Приводные элементы созданы."); //отключил сообщение
})();
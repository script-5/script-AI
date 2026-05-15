// ExtendScript для Adobe Illustrator 23.0.5
//дублирование шкалы 4 мм от края артборда

(function main() {
    if (app.documents.length === 0) {
        alert("Пожалуйста, откройте документ.");
        return;
    }

    var doc = app.activeDocument;
    var sel = doc.selection;

    if (sel === null || sel.length === 0) {
        alert("Пожалуйста, выделите объекты.");
        return;
    }

    var mm = 2.834645; // Конвертация 1 мм в пункты (pt)
    var offset = 4 * mm; // Смещение 4 (наружу артборда от правой границы)

    // 1. Создаем временную группу на текущем активном слое
    var containerLayer = doc.activeLayer;
    var newGroup = containerLayer.groupItems.add();
    newGroup.name = "Temp_Transform_Group";

    // 2. Дублируем объекты в группу
    // Используем PLACEATEND, чтобы сохранить визуальный порядок наложения объектов
    for (var i = 0; i < sel.length; i++) {
        sel[i].duplicate(newGroup, ElementPlacement.PLACEATEND);
    }

    // 3. Поворот группы как единого целого на 180 градусов
    // Поворот происходит вокруг геометрического центра группы
    newGroup.rotate(180);

    // 4. Позиционирование группы
    var abIdx = doc.artboards.getActiveArtboardIndex();
    var abRect = doc.artboards[abIdx].artboardRect; // [left, top, right, bottom]
    var abRight = abRect[2]; // Координата правого края артборда

    // Получаем границы группы ПОСЛЕ поворота
    var groupBounds = newGroup.geometricBounds; // [L, T, R, B]
    var currentLeft = groupBounds[0];

    // Целевая координата X для левого края группы
    var targetX = abRight + offset; 

    // Вычисляем дистанцию для перемещения
    var deltaX = targetX - currentLeft;

    // Перемещаем всю группу целиком
    newGroup.translate(deltaX, 0);

    // 5. Разгруппировка (возвращаем объекты на слой и удаляем группу)
    // Перемещаем объекты из группы на слой, сохраняя их позиции
    var itemsInside = newGroup.pageItems;
    var len = itemsInside.length;

    // Перемещаем элементы по одному наружу
    for (var j = len - 1; j >= 0; j--) {
        itemsInside[j].move(containerLayer, ElementPlacement.PLACEATBEGINNING);
    }

    // Удаляем пустую группу
    newGroup.remove();

    // 6. Сброс выделения
    doc.selection = null;

})();


// ExtendScript для Adobe Illustrator 23.0.5
//Указатель направления печати при шкале -2 от края артборда
(function main() {
    if (app.documents.length === 0) {
        alert("Нет открытого документа");
        return;
    }

    var doc = app.activeDocument;
    
    // --- НОВОЕ: Снять выделение со всех объектов в документе ---
    doc.selection = null;

    var mm = 2.834645; // Конвертация 1 мм в пункты (pt)

    // 1. Создание или выбор слоя "direction"
    var layerName = "direction";
    var directionLayer;
    try {
        directionLayer = doc.layers.getByName(layerName);
    } catch (e) {
        directionLayer = doc.layers.add();
        directionLayer.name = layerName;
    }
    doc.activeLayer = directionLayer;

    // Определение цвета (Белый CMYK)
    var whiteColor = new CMYKColor();
    whiteColor.cyan = 0; whiteColor.magenta = 0; whiteColor.yellow = 0; whiteColor.black = 0;

    // Координаты активного артборда [left, top, right, bottom]
    var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()].artboardRect;
    var L = ab[0]; // Левый край артборда
    var T = ab[1]; // Верхний край артборда
    var R = ab[2]; // Правый край артборда
    var B = ab[3]; // Нижний край артборда
    
    // --- Параметры треугольника ---
    var triangleWidth = 3.5 * mm;
    var triangleHeight = triangleWidth * Math.sqrt(3) / 2; 

    /**
     * Функция создания равнобедренного треугольника, стоящего основанием ВВЕРХ.
     */
    function createBaseUpTriangle(xCenter, yCenter, width, height, targetLayer) {
        var group = targetLayer.groupItems.add();
        
        // Координаты для основания ВВЕРХ
        var apexY = yCenter + height / 2; // Вершина (верхняя точка)
        var baseY = yCenter - height / 2; // Основание (нижняя линия)

        var baseLeftX = xCenter - width / 2;
        var baseRightX = xCenter + width / 2;

        var tri = group.pathItems.add();
        tri.setEntirePath([
            [baseLeftX, baseY],   
            [baseRightX, baseY],  
            [xCenter, apexY]      
        ]);
        tri.closed = true;

        tri.fillColor = whiteColor;
        tri.stroked = false; 
        tri.fillOverprint = false; 
        tri.strokeOverprint = false;

        return group;
    }

    // --- Создание первого треугольника (Объект 1) ---
    // Y-позиция: Центр Y = -6.516  мм от верхнего края (T - 6.516 мм)
    var obj1_yCenter = T - (6.516  * mm);

    // X-позиция: 4 мм от левого края артборда до вершины (верхней точки)
    var obj1_apexX = L - (4 * mm);
    var obj1_xCenter = obj1_apexX;

    var obj1 = createBaseUpTriangle(obj1_xCenter, obj1_yCenter, triangleWidth, triangleHeight, directionLayer);

    // --- Дублирование и размещение второго треугольника (Объект 2) ---
    var obj2 = obj1.duplicate();

    // X-позиция: 4 мм от правого края до вершины
    var obj2_apexX = R + (4 * mm);
    var obj2_xCenter = obj2_apexX;
    
    var obj2_yCenter = obj1_yCenter;

    // Расчет смещения
    var currentBoundsObj2 = obj2.geometricBounds; 
    var currentXCenterObj2 = currentBoundsObj2[0] + (currentBoundsObj2[2] - currentBoundsObj2[0]) / 2;
    var currentYCenterObj2 = currentBoundsObj2[3] + (currentBoundsObj2[1] - currentBoundsObj2[3]) / 2;

    var deltaX = obj2_xCenter - currentXCenterObj2;
    var deltaY = obj2_yCenter - currentYCenterObj2; 

    obj2.translate(deltaX, deltaY);

    // --- Итоговое выделение ---
    doc.selection = null; // Еще раз на всякий случай сбрасываем всё
    //obj2.selected = true; // Оставляем выделенным только второй объект

})();

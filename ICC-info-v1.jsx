#target illustrator
// Скрипт делает следующее:
//
//Проверяет, открыт ли документ.
//Получает colorProfileName.
//Если выделен текстовый блок — вставляет туда имя ICC и ставит метку (note = "ICC-name").
//Если выделения нет — ищет все текстовые блоки с меткой "ICC-name" и обновляет их.

(function () { //обновляет имя ICC профиля
    if (app.documents.length === 0) {
        alert("Нет открытого документа.");
        return;
    }

    var doc = app.activeDocument;
    var iccName = doc.colorProfileName; // имя ICC профиля документа

    var selection = doc.selection;
    var updated = false;

    // Если выделен текстовый блок
    if (selection.length > 0 && selection[0].typename === "TextFrame") {
        var tf = selection[0];
        tf.contents = "Профиль печати: " + iccName;
        tf.note = "ICC-name"; // помечаем этот блок
        updated = true;
    } else {
        // Ищем все текстовые блоки с пометкой ICC-name
        var tfs = doc.textFrames;
        for (var i = 0; i < tfs.length; i++) {
            if (tfs[i].note === "ICC-name") {
                tfs[i].contents = "Профиль печати: " + iccName;
                updated = true;
            }
        }
    }

    if (!updated) {
        // alert("Не найдено выделенного текстового блока или блоков с пометкой ICC-name.");
    }

})();
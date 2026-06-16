// RU //
// ----------------------
// -=> Дата/время/путь <=-
// ----------------------
//
// Скрипт Javascript для Adobe Illustrator
//
// Версия v.3 от 26.08.2025
//
// Этот скрипт вставляет фактическую дату или фактическое время в
// заранее определенную позицию в документе.
//
// Чтобы определить позицию, вам нужно будет создать текстовый объект и
// выполните этот скрипт, пока объект выбран. Весь объект в целом
// должен быть выбран, а не слова или буквы. Вы можете отметить больше
// объекты, если вы выделите каждый объект отдельно и выполните
// сценарий на нем.
//
// С помощью заполнителей
// "{FILENAME}{FILEEXT} {DATE}, {TIME}, {NUMDER}" вы можете определить
// конкретный пункт, в котором следует заменить дату или время.
// Если в текстовом объекте нет заполнителя
// В качестве стандартных заполнителей будут использоваться:
//   {FILE}     - полное имя файла документа с указанием пути
//   {FILEPATH} - только путь к файлу документа
//   {FILENAME} - имя файла документа
//   {FILEEXT}  - расширение файла документа, включающее точку
//   {NUMDER}  - только номер документа до первого пробела
//
// В моей системе этот скрипт не может видеть путь к документу, когда
// он был открыт непосредственно из проводника Windows (двойным щелчком мыши).).
//
// В Illustrator CS теперь можно редактировать объект DateAndTime.
//
// -------------------------------------------------------------------

var language="RU";   // "de" fuer Deutsch

// -------------------------------------------------------------------

var WR="Имя Файла/Дата/время/путь v0.9\n\n";

var AIversion=version.slice(0,2);

if (language == "RU") {

  var format_preset = "{FILENAME}";

  var MSG_unsetmark = WR+"Этот объект помечен как текущая дата/время, следует ли снять отметку?";
  var MSG_setmark = WR+"Должен ли этот текстовый объект быть помечен как текущей датой/ временем?";
  var MSG_askformat = WR+"Должен ли текстовый объект быть отформатирован как дата/время? Форматы:\n{DATE}, {TIME}, {FILE}, {FILEPATH}, {FILENAME} и {FILEEXT}:"
  var MSG_editformat = WR+"Формат (пусто = удалить). {FILENAME} удаляет текст в {} скобках {NUMBER} до пробела, {FILE} {DATE} {TIME} {FILEPATH} {FILEEXT}"
  var MSG_notexto = WR+"Нет текстового объекта!";
  var MSG_selectedmany = "Только один текстовый объект должен быть выбран, чтобы отметить его как текущую дату/время, и ни один объект не должен быть выбран,если вы хотите обновить данные.";
  var MSG_nodocs = WR+"Нет документа, который был бы открыт."
  var Timeformat = 24;
  var TimeSep = ":";
  var AM = " am";
  var PM = " pm";
  var Dateformat = "dd.mm.yyyy";

} else {

  var format_preset = "{FILENAME}";

  var MSG_unsetmark = WR+"Этот объект помечен как актуальная дата и время, вы хотите удалить эту метку?";
  var MSG_setmark = WR+"Вы хотите пометить выбранный текстовый объект как актуальную дату и время?";
  var MSG_askformat = WR+"Вы хотите пометить текстовый объект как фактическую дату и время? Formats:\n{DATE}, {TIME}, {FILE}, {FILEPATH}, {FILENAME} and {FILEEXT}:"
  var MSG_editformat = WR+"Редактировать дату и время (empty = remove). Formats:\n{DATE}, {TIME}, {FILE}, {FILEPATH}, {FILENAME} and {FILEEXT}:"
  var MSG_notexto = WR+"Нет текстового объекта!";
  var MSG_selectedmany = "Чтобы пометить как актуальные дату и время, вам нужно выбрать только один текстовый объект. Если вы хотите обновить объекты даты и времени, не должно быть выделено ни одного объекта.";
  var MSG_nodocs = WR+"У вас нет открытого документа."
  var Timeformat = 12;
  var TimeSep = ":";
  var AM = " am";
  var PM = " pm";
  var Dateformat = "mm/dd/yyyy";

}

var error=0;

if (documents.length<1) {
  error++;
  alert(MSG_nodocs)
}

if (error < 1) {
  date_n_time();
}

function TodayDate()
{
  var Today = new Date();
  var Day = Today.getDate();
  var Month = Today.getMonth() + 1;
  var Year = Today.getYear();
  var PreMon = ((Month < 10) ? "0" : "");
  var PreDay = ((Day < 10) ? "0" : "");
  if(Year < 999) Year += 1900;

  var theDate = Dateformat.replace(/dd/,PreDay+Day);
  theDate = theDate.replace(/mm/,PreMon+Month);
  theDate = theDate.replace(/d/,Day);
  theDate = theDate.replace(/m/,Month);
  theDate = theDate.replace(/yyyy/,Year);
  theDate = theDate.replace(/yy/,Year.toString().substr(2,2));

  return theDate;
}

function TodayTime()
{
  var Today = new Date();
  var Hours = Today.getHours();
  var Minutes = Today.getMinutes();
  var Suffix = "";
  if (Timeformat == 12) {
    if (Hours >= 12 ) {
      Suffix = PM;
    } else {
      Suffix = AM;
    }
    if (Hours >= 13) {
      Hours = Hours - 12;
    }
    if (Hours < 1) {
      Hours = Hours + 12;
    }
  }
  var PreHour = ((Hours < 10) ? "0" : "");
  var PreMin = ((Minutes < 10) ? "0" : "");
  return PreHour+Hours+TimeSep+PreMin+Minutes+Suffix;
}

function DateUpdate(Name) {
    var docpath = activeDocument.path.fsName;
    var docname = activeDocument.name.replace(/(.*?)(?:\.([^.]+))?$/,'$1');
    var extension = activeDocument.name.replace(/(.*?)(?:(\.[^.]+))?$/,'$2');
	        
    // ИЗМЕНЕНИЕ: Теперь удаляет текст как в фигурных, так и в круглых скобках
    docname = docname.replace(/\{.*?\}|\(.*?\)/g, ''); 
    
    var newName = docname + extension;
    var docnumber = docname.split(' ')[0]; 
	
    if (docpath.slice(2,3) == "\\") {
      docsep = "\\";
    } else {
      docsep = ":";
    }
    var content = Name.slice(11);
    content = content.replace(/\{FILE\}/,docpath+docsep+docname);
    content = content.replace(/\{FILEPATH\}/,docpath);
    content = content.replace(/\{FILENAME\}/,docname);
    content = content.replace(/\{NUMBER\}/,docnumber); 
    content = content.replace(/\{FILEEXT\}/,extension);
    content = content.replace(/\{DATE\}/,TodayDate());
    content = content.replace(/\{TIME\}/,TodayTime());
    return content;
}

function date_n_time()
{
  if (selection.length == 1) {
    if (selection[0].typename == "TextArtItem" || selection[0].typename == "TextFrame") {
      if (selection[0].name.slice(0,11) == "actualDate:") {
        dateformat = selection[0].name.slice(11);
        Check = false;
        if (AIversion == "10") {
          Check = confirm( MSG_unsetmark );
        } else {
          dateformat = prompt(MSG_editformat, dateformat);
        }
        if(dateformat != "" && Check) {
          selection[0].contents = selection[0].name.slice(11);
          selection[0].name="";
        }
        if(dateformat == "" && !Check) {
          selection[0].name="";
        }
        if(dateformat && dateformat !="" && !Check) {
          selection[0].name="actualDate:"+dateformat;
          selection[0].contents = DateUpdate(selection[0].name);
        }
      } else {
        dateformat = selection[0].contents;
        if(dateformat.search(/\{DATE\}/) == -1 && dateformat.search(/\{TIME\}/) == -1 && dateformat.search(/\{FILE[A-Z]*\}/) == -1) dateformat = format_preset;
        Check = false;
        if (AIversion == "10") {
          Check = confirm( MSG_setmark );
        } else {
          dateformat = prompt(MSG_askformat, dateformat);
        }
        if (dateformat || Check) {
          selection[0].name="actualDate:"+dateformat;
          selection[0].contents = DateUpdate(selection[0].name);
        }
      }
    } else {
      alert ( MSG_notexto );
    }
  } else if (selection.length > 1) {
    alert ( MSG_selectedmany );
  } else {
    if (AIversion == "10") {
      var textArtItems = activeDocument.textArtItems;
      for (var i = 0 ; i < textArtItems.length; i++)
      {
        if (textArtItems[i].name.slice(0,11) == "actualDate:") {
          textArtItems[i].contents = DateUpdate(textArtItems[i].name);
        }
      }
    } else {
      var textFrames = activeDocument.textFrames;
      for (var i = 0 ; i < textFrames.length; i++)
      {
        if (textFrames[i].name.slice(0,11) == "actualDate:") {
          textFrames[i].contents = DateUpdate(textFrames[i].name);
        }
      }
    }
  }
  // снимаем выделение после всех операций
  app.activeDocument.selection = [];
}
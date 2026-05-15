////////////////////////////////////////////////////////////
// ------------------------
// -=> Select and remove all white overprints <=-
// ------------------------
//
// A Javascript for Adobe Illustrator
//
// 18.10.2011
//
// This script is a sandbox
//
//$.bp()

activeDocument.selection = 0;

for(i=0;i<activeDocument.pageItems.length;i++)
{
 obj=activeDocument.pageItems[i];
 if((obj.fillOverprint)&&(obj.editable)&&(obj.fillColor.black == 0)&&(obj.fillColor.magenta == 0)&&(obj.fillColor.yellow == 0)&&(obj.fillColor.cyan == 0)) obj.selected=true; 
}

if (activeDocument.selection !=0) {
//if(confirm('Do you want to remove those overprints?'))
{
    for(i=0;i<activeDocument.pageItems.length;i++) 
    {
        obj = activeDocument.pageItems[i];
        if(obj.selected) obj.fillOverprint = false; 
    }
    //alert ('All fill overprint was removed.')
 }
}

activeDocument.selection = 0;

for(i=0;i<activeDocument.pageItems.length;i++)
{
 obj=activeDocument.pageItems[i];
 if((obj.strokeOverprint)&&(obj.editable)&&(obj.strokeColor.black == 0)&&(obj.strokeColor.magenta == 0)&&(obj.strokeColor.yellow == 0)&&(obj.strokeColor.cyan == 0)) obj.selected=true;
}

if (activeDocument.selection !=0) {
if(confirm('Do you want to remove those overprints?'))
{
    for(i=0;i<activeDocument.pageItems.length;i++) 
    {
        obj = activeDocument.pageItems[i];
        if(obj.selected) obj.strokeOverprint = false; 
    }
    //alert ('All stroke overprint was removed.')
 }
}
function createFolder(parentId,name){
  var folder=DriveApp.getFolderById(parentId);
  return folder.createFolder(name);
}


function copyFile(fileId,destinationFolderId,name){
  var file=DriveApp.getFileById(fileId);
  var folder=DriveApp.getFolderById(destinationFolderId);
  var newFile=file.makeCopy(folder);
  newFile.setName(name);
  return newFile;
}

function moveFile(fileId,destinationFolderId,name){
  var newFile= copyFile(fileId,destinationFolderId,name);
  if (newFile)
    Drive.Files.remove(fileId);
  return newFile;
}


function ShareFile(email,fileId){
  var file=DriveApp.getFileById(fileId);
  file.addViewer(email);
}

function ShareFileWithoutNotification(email,fileId){
  Drive.Permissions.insert(
   {
     'role': 'writer',
     'type': 'user',
     'value': email
   },
   fileId,
   {
     'sendNotificationEmails': 'false',
     'supportsAllDrives': 'true'
   });
}
function getFolders(folderName)
{      
  var folders = DriveApp.getFolders();     
 while (folders.hasNext()) {
   var folder = folders.next();
   if(folderName == folder.getName()) {         
     return folder;
   }
 }
  return null;
}


function ExceltoGoogleSpreadsheet(fileId) {
  
  try {           
    var excelFile = DriveApp.getFileById(fileId);
    var folderId = Drive.Files.get(fileId).parents[0].id;         
    var blob = excelFile.getBlob();

    var resource = {
      title: excelFile.getName(),
      mimeType: MimeType.GOOGLE_SHEETS,
      parents: [{id: folderId}],
    };    
    var gFile=Drive.Files.insert(resource, blob);    
    return gFile.id;
  } catch (f) {
    Logger.log(f.toString());
  }  
  return null;
}

/**
 * It only creates directories that don't exist
 * @param {array} path the directories to create as an array in top-down order, their names as strings. 
 * @param {string} rootFolder the base folder ID under which to create the directories. 
 * @return {folder} the leaf folder
 */
function MkDirTree(path, rootFolder) {
  return path.reduce(function(currentFolder, pathElement) {
    var subFolders = currentFolder.getFolders();
    while(subFolders.hasNext()) {
      var subFolder = subFolders.next();
      if(subFolder.getName() == pathElement) {
        return subFolder;
      }
    }
    return currentFolder.createFolder(pathElement);
  }, DriveApp.getFolderById(rootFolder));
}

/**
 * 
 * @param {folder} folder folder to check 
 * @param {string} fileName 
 * @returns {boolean} true if exists
 */
function FileExists(folder, fileName) {
  var iterator = folder.getFilesByName(fileName);
  return iterator.hasNext();
}

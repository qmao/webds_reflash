import { requestAPI, webdsService } from './local_exports';

export async function start_reflash(file_name: string): Promise<string> {
  const action = 'start';
  const dataToSend = {
    filename: file_name,
    action: action
  };

  console.log('filename:', file_name);
  //console.log('blocks:', props.ui.selectedBlocks);

  try {
    const reply = await requestAPI<any>('reflash', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    });
    console.log(reply);
    return Promise.resolve(reply);
  } catch (e) {
    console.error(`Error on POST ${dataToSend}.\n${e}`);
    return Promise.reject((e as Error).message);
  }
}

export async function start_fetch(packrat: string): Promise<string> {
  console.log(packrat);
  let path = '';
  try {
    let files = await webdsService.packrat.cache.addPackratFiles(
      ['img'],
      Number(packrat!)
    );
    path = packrat + '/PR' + packrat + '.img';
    console.log(files);
    console.log(path);
    return Promise.resolve(path);
  } catch (error) {
    console.log(error);
    return Promise.reject('Image file not found');
  }
}

export async function get_list(
  exetension: string
): Promise<string[] | undefined> {
  try {
    const reply = await requestAPI<any>('packrat?extension=' + exetension, {
      method: 'GET'
    });
    return Promise.resolve(reply['filelist']);
  } catch (error) {
    console.log(error);
    return Promise.reject(error.message);
  }
}

export async function get_lists(): Promise<string[] | undefined> {
  try {
    let list = await get_list('img');
    return Promise.resolve(list);
  } catch (error) {
    console.log(error);
    return Promise.reject(error.message);
  }
}

export async function upload_img(file: File): Promise<string> {
  console.log('upload img file:', file);
  const regex = /PR\d+/g;
  const packrat = file.name.match(regex);
  let fileName = '';
  let packratID = '';

  try {
    if (!packrat) return Promise.reject('invalid file name');
    packratID = packrat![0].substr(2);
    fileName = file.name;

    const formData = new FormData();
    formData.append('fileToUpload', file, fileName);

    await requestAPI<any>('packrat/' + packratID, {
      body: formData,
      method: 'POST'
    });
  } catch (error) {
    console.error(`Error - POST /webds/packrat/${packratID}\n${error}`);
    return Promise.reject('Failed to upload blob to Packrat cache');
  }
  return Promise.resolve(packratID + '/' + fileName);
}

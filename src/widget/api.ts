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

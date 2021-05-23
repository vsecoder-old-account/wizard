// In this file MAGIC

delete_words = "как зачем почему когда ибо но не нет да потому что потому-что видимо возможно иногда сейчас надо и а";
delete_words = delete_words.split(" ");

module.exports.func = function (read, finde) {
  if (read == undefined) {
    return;
  }
  var arr = [];
  var finding = 0;
  try {
    finde = finde.split(" ");
    for (let index = 0; index < finde.length; index++) {
      var element = finde[index];
      try {
        for (let i = 0; i < 999999999999; i++) {
          var web = read[i].web;
          var q_el = read[i].web.description.split(" ");
          for (let m = 0; m < q_el.length; m++) {
            var m_el = q_el[m].replace(/[.,\/#!$%?\^&\*;:{}=\-_`~()]/g, "");
            m_el = m_el.toLowerCase();
            element = element.toLowerCase();
            //console.log(element + ' | ' + m_el + ' = ' + finding);
            for (let a = 0; a < delete_words.length; a++) {
              const word = delete_words[a];
              if (m_el == word || element == word) {
                //
              } else {
                var arr_to = arr;
                if (arr.length != 0) {
                  for (let d = 0; d < arr_to.length; d++) {
                    const arr_el = array[d].description;
                    console.log(arr_el);
                    if (element == m_el && finding <= 9 && web.description != arr_el) {
                      arr.push({
                        "title": web.title,
                        "url": web.url,
                        "description": web.description
                      });
                      finding++;
                    }
                  }
                } else {
                  if (element == m_el && finding <= 9) {
                    arr.push({
                      "title": web.title,
                      "url": web.url,
                      "description": web.description
                    });
                    finding++;
                  }
                }
              }
            }
          }

        }
      } catch (error) {
        // TODO: deelte try ... catch
      }
    }
    if (finding == 0) {
      // TODO: parse yandex if result not find
    }
  } catch (error) {
    console.log(error);
  }
  console.log(arr);
  return arr;
};

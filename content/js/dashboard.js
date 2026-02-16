/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 67.7115987460815, "KoPercent": 32.288401253918494};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5086605080831409, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b039eb69-ebe1-4dc5-8f69-321b8fec94c5"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8e6a3f1-247f-42f3-90a0-5f2f46e2aee6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b039eb69-ebe1-4dc5-8f69-321b8fec94c5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=938d073b-6c33-445a-a0af-bd9e907203e7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/817a7cd4-4fe6-4926-b3d1-669d992e4592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce331375-31e4-4d65-a152-a1a1957f64ee"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/938d073b-6c33-445a-a0af-bd9e907203e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14604bdd-c6d6-4da1-a55f-3b3355251809"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e758ae0a-7ad2-4d86-bc64-3590871f18a7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/955c1f88-6a88-4877-9c0d-ffe994e5de2d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21773a08-f6ed-4c9a-b9c2-16ddf447b8ca"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/4f611306-834b-4568-9924-8c4b83ae8276"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a93a403-323e-42c8-88f1-3ed2ce0499df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21773a08-f6ed-4c9a-b9c2-16ddf447b8ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e758ae0a-7ad2-4d86-bc64-3590871f18a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5ee49e7-7588-42f0-b8fb-cfa8a5aa0fe6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c5ee49e7-7588-42f0-b8fb-cfa8a5aa0fe6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40a139ae-761a-48fb-8769-f91353c6319a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40a139ae-761a-48fb-8769-f91353c6319a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7306af46-4e63-4d0f-8035-1bc29a4fa682"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a6ccbb6-e105-47c2-bd4c-195a6c3db6c1"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fde252f-e2bb-4d8e-84d1-43b79ec21525"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3361368c-54c0-46ce-b2c5-1246ebba052b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3361368c-54c0-46ce-b2c5-1246ebba052b"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=955c1f88-6a88-4877-9c0d-ffe994e5de2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a6ccbb6-e105-47c2-bd4c-195a6c3db6c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/14604bdd-c6d6-4da1-a55f-3b3355251809"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce331375-31e4-4d65-a152-a1a1957f64ee"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7306af46-4e63-4d0f-8035-1bc29a4fa682"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1fde252f-e2bb-4d8e-84d1-43b79ec21525"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cb24929-4aa1-496a-9443-4d62a64179be"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cb24929-4aa1-496a-9443-4d62a64179be"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 638, 206, 32.288401253918494, 310.70846394984284, 1, 3861, 134.0, 657.1000000000003, 1090.0499999999981, 1733.27, 2.4657957795470358, 2.5897287093220993, 1.17710995473255], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b039eb69-ebe1-4dc5-8f69-321b8fec94c5", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["see books", 60, 60, 100.0, 759.4666666666665, 505, 1635, 776.5, 920.7, 1196.699999999999, 1635.0, 0.2581411257534494, 1.6663589476554332, 0.43181497949929226], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 176.0, 128, 386, 132.0, 382.0, 386.0, 386.0, 0.08316903372259703, 0.06456970879830531, 0.029563992456079415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, 100.0, 249.13333333333333, 126, 1409, 129.0, 792.8000000000004, 1409.0, 1409.0, 0.1285578381713933, 0.0639022847941789, 0.06453000861337516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8e6a3f1-247f-42f3-90a0-5f2f46e2aee6", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.0301159274193548, 1.924773185483871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 14, 100.0, 146.71428571428572, 126, 380, 129.0, 256.0, 380.0, 380.0, 0.0983311794122605, 0.04887751007894589, 0.049357642790919816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 2.3222194881889764, 4.867433562992126], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 246.58333333333331, 124, 1250, 129.5, 517.0, 526.65, 1250.0, 0.2516039753428104, 0.12506486664989308, 0.12162496854950308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b039eb69-ebe1-4dc5-8f69-321b8fec94c5", 3, 0, 0.0, 551.3333333333334, 203, 1056, 395.0, 1056.0, 1056.0, 1056.0, 0.033510941322341746, 0.02793669294482982, 0.021489763803715246], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 494.06666666666666, 1, 1314, 462.0, 925.8000000000002, 1314.0, 1314.0, 0.08684274515706958, 0.026991358423167328, 0.05481382905584568], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 494.06666666666666, 1, 1314, 462.0, 925.8000000000002, 1314.0, 1314.0, 0.08558273282782466, 0.026599737403648106, 0.0540185283050625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1094.7499999999998, 204, 2203, 1016.0, 1765.0, 2100.75, 2203.0, 0.09319592112518542, 0.029396760276791885, 0.04204737847640202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=938d073b-6c33-445a-a0af-bd9e907203e7", 1, 0, 0.0, 794.0, 794, 794, 794.0, 794.0, 794.0, 794.0, 1.2594458438287153, 0.22753660264483627, 0.8683288727959697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/817a7cd4-4fe6-4926-b3d1-669d992e4592", 1, 0, 0.0, 1186.0, 1186, 1186, 1186.0, 1186.0, 1186.0, 1186.0, 0.8431703204047217, 0.2692545847386172, 0.5031026032883643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 228.5, 129, 483, 135.0, 433.5, 483.0, 483.0, 0.07528257853586139, 0.05925562333975028, 0.02676060408891948], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 420.8571428571429, 129, 613, 424.5, 569.5, 613.0, 613.0, 0.08413107621674569, 0.017100861892829028, 0.056754439041025916], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1325.090909090909, 724, 3861, 1197.5, 1887.1999999999998, 3575.099999999996, 3861.0, 0.09817221190918178, 0.05081178936705698, 0.045155382626195915], "isController": false}, {"data": ["goToProfile", 16, 1, 6.25, 385.4375, 127, 1721, 223.5, 1255.5000000000005, 1721.0, 1721.0, 0.0893665032004379, 0.18078935233023155, 0.05729950659915772], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce331375-31e4-4d65-a152-a1a1957f64ee", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 14, 100.0, 227.00000000000003, 128, 1223, 130.0, 802.5, 1223.0, 1223.0, 0.07135612311989357, 0.035469010417993975, 0.03581742898791533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/938d073b-6c33-445a-a0af-bd9e907203e7", 3, 0, 0.0, 300.3333333333333, 207, 393, 301.0, 393.0, 393.0, 393.0, 0.04761980348894427, 0.03969867081223511, 0.030537439086334703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14604bdd-c6d6-4da1-a55f-3b3355251809", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e758ae0a-7ad2-4d86-bc64-3590871f18a7", 3, 0, 0.0, 278.0, 201, 423, 210.0, 423.0, 423.0, 423.0, 0.04155642670138937, 0.03402161886523251, 0.026649140820877947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/955c1f88-6a88-4877-9c0d-ffe994e5de2d", 3, 0, 0.0, 884.0, 371, 1721, 560.0, 1721.0, 1721.0, 1721.0, 0.03331297540391983, 0.02777165690411415, 0.02136281300316473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21773a08-f6ed-4c9a-b9c2-16ddf447b8ca", 1, 0, 0.0, 2012.0, 2012, 2012, 2012.0, 2012.0, 2012.0, 2012.0, 0.49701789264413515, 0.08979327162027832, 0.34267053926441354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f611306-834b-4568-9924-8c4b83ae8276", 2, 0, 0.0, 451.0, 356, 546, 451.0, 546.0, 546.0, 546.0, 0.014345967348578315, 0.028194589149427594, 0.008917195524775485], "isController": false}, {"data": ["addBook", 62, 62, 100.0, 809.9354838709676, 517, 2268, 767.5, 1072.6000000000001, 1231.6999999999994, 2268.0, 0.2912288448079064, 0.9387231171115735, 0.567783403537491], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0a93a403-323e-42c8-88f1-3ed2ce0499df", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21773a08-f6ed-4c9a-b9c2-16ddf447b8ca", 3, 0, 0.0, 380.0, 302, 426, 412.0, 426.0, 426.0, 426.0, 0.03747049198755979, 0.031237607415410363, 0.024028928781084896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e758ae0a-7ad2-4d86-bc64-3590871f18a7", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5ee49e7-7588-42f0-b8fb-cfa8a5aa0fe6", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 149.92857142857142, 126, 385, 131.0, 263.0, 385.0, 385.0, 0.09006690684508492, 0.06728631224266599, 0.032015970792588784], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 583.6666666666666, 127, 2012, 454.0, 1288.4000000000005, 2012.0, 2012.0, 0.08554856592087327, 0.016107190927289423, 0.05857514764256669], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 8, 4.3478260869565215, 209.79891304347825, 2, 1208, 134.0, 388.0, 489.5, 755.800000000003, 0.7384931528841369, 1.601363233526385, 0.3531492631624364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 154.66666666666669, 127, 385, 132.0, 315.7000000000003, 385.0, 385.0, 0.0650008395941781, 0.05033756425603831, 0.023105767199492994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5ee49e7-7588-42f0-b8fb-cfa8a5aa0fe6", 3, 0, 0.0, 419.6666666666667, 226, 613, 420.0, 613.0, 613.0, 613.0, 0.05060387288307131, 0.0325334143698131, 0.032451051295459145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40a139ae-761a-48fb-8769-f91353c6319a", 3, 0, 0.0, 290.0, 204, 458, 208.0, 458.0, 458.0, 458.0, 0.019675485656570957, 0.02712424536314388, 0.0126174175597151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40a139ae-761a-48fb-8769-f91353c6319a", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 20, 100.0, 181.95, 125, 939, 129.0, 354.5000000000005, 910.9999999999995, 939.0, 0.08944663837171339, 0.044461268487502065, 0.04489801965142645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 151.00000000000003, 127, 378, 133.0, 245.4000000000001, 378.0, 378.0, 0.0992621513416934, 0.08055356227045626, 0.03528459285974258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7306af46-4e63-4d0f-8035-1bc29a4fa682", 3, 0, 0.0, 335.3333333333333, 207, 472, 327.0, 472.0, 472.0, 472.0, 0.03199965867030752, 0.03209340767031818, 0.020520614446779235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a6ccbb6-e105-47c2-bd4c-195a6c3db6c1", 1, 0, 0.0, 806.0, 806, 806, 806.0, 806.0, 806.0, 806.0, 1.2406947890818858, 0.22414896091811412, 0.855400899503722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 483.3636363636363, 181, 922, 442.5, 783.6999999999999, 902.1999999999997, 922.0, 0.09738650046037255, 0.059820418739818686, 0.04403315401675048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fde252f-e2bb-4d8e-84d1-43b79ec21525", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3361368c-54c0-46ce-b2c5-1246ebba052b", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3361368c-54c0-46ce-b2c5-1246ebba052b", 2, 0, 0.0, 255.5, 203, 308, 255.5, 308.0, 308.0, 308.0, 0.021233451178987377, 0.024157197874531536, 0.01319833171428268], "isController": false}, {"data": ["login", 22, 4, 18.181818181818183, 2179.5000000000005, 1281, 4970, 2093.0, 3000.7, 4679.599999999996, 4970.0, 0.09680499513774911, 0.1436089727229925, 0.145439535930054], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, 100.0, 131.25, 127, 143, 130.0, 141.8, 143.0, 143.0, 0.06545395041863256, 0.03253521558894919, 0.03285481495622767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=955c1f88-6a88-4877-9c0d-ffe994e5de2d", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a6ccbb6-e105-47c2-bd4c-195a6c3db6c1", 3, 0, 0.0, 288.0, 214, 429, 221.0, 429.0, 429.0, 429.0, 0.05224387440572593, 0.03358777732789997, 0.0335027449802344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 216.13333333333335, 129, 391, 136.0, 388.0, 391.0, 391.0, 0.1297779931131145, 0.10506441044020697, 0.046132020989427425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14604bdd-c6d6-4da1-a55f-3b3355251809", 3, 0, 0.0, 570.3333333333334, 233, 952, 526.0, 952.0, 952.0, 952.0, 0.02398234899114252, 0.024208744863780256, 0.01537930583090845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 143.1176470588235, 126, 378, 128.0, 182.79999999999984, 378.0, 378.0, 0.08093465240947222, 0.04023021296525523, 0.04062540169772336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce331375-31e4-4d65-a152-a1a1957f64ee", 3, 0, 0.0, 486.3333333333333, 211, 860, 388.0, 860.0, 860.0, 860.0, 0.04280516515659556, 0.027519596739673257, 0.027449926874509527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 1, 5.0, 163.7, 1, 379, 132.0, 377.8, 378.95, 379.0, 0.08863166011530979, 0.07875580814347694, 0.029930496160033328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, 100.0, 144.79999999999998, 127, 377, 128.0, 228.80000000000007, 377.0, 377.0, 0.1539045586530273, 0.07650138706483486, 0.07725287416763285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7306af46-4e63-4d0f-8035-1bc29a4fa682", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 149.66666666666669, 128, 381, 131.0, 250.80000000000007, 381.0, 381.0, 0.15310809431458608, 0.11886810056649995, 0.05442514290088803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fde252f-e2bb-4d8e-84d1-43b79ec21525", 3, 0, 0.0, 289.3333333333333, 209, 377, 282.0, 377.0, 377.0, 377.0, 0.02789919092346322, 0.022840646215009766, 0.017891082721101088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cb24929-4aa1-496a-9443-4d62a64179be", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, 100.0, 161.73333333333335, 126, 580, 129.0, 333.40000000000015, 580.0, 580.0, 0.10047356540494196, 0.049942426553823686, 0.05043302013490251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, 100.0, 128.0, 126, 130, 128.0, 130.0, 130.0, 130.0, 0.04675045386898964, 0.023238262714175516, 0.026517794878487776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cb24929-4aa1-496a-9443-4d62a64179be", 3, 0, 0.0, 350.3333333333333, 255, 492, 304.0, 492.0, 492.0, 492.0, 0.056381439230205416, 0.03624783283842958, 0.03615606617301584], "isController": false}, {"data": ["register", 24, 6, 25.0, 1094.7499999999998, 204, 2203, 1016.0, 1765.0, 2100.75, 2203.0, 0.09324733856554511, 0.029412978863936592, 0.042070576579376795], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 2.912621359223301, 0.9404388714733543], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 3, 1.4563106796116505, 0.4702194357366771], "isController": false}, {"data": ["401/Unauthorized", 9, 4.368932038834951, 1.4106583072100314], "isController": false}, {"data": ["404/Not Found", 188, 91.2621359223301, 29.46708463949843], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 638, 206, "404/Not Found", 188, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 8, "401/Unauthorized", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

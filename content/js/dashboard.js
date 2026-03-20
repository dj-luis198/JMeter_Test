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

    var data = {"OkPercent": 97.34904270986745, "KoPercent": 2.6509572901325478};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7560126582278481, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a39b041d-cea6-4522-8951-c4018519337d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b544fb10-55eb-4db9-85e6-ddd20155ea63"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b080298a-490c-445a-8dcf-a686541b0426"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be46a606-8c08-4010-ba34-17507dbbbc01"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f503811-77ae-4659-b92d-0115527c49bb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a25d188d-e017-4ec7-8aa9-78aabc5c493e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b9fbfe2-1de8-4375-82b8-c34d7e95305a"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/edd9fe83-dcbd-4024-9195-dc423b50d3f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03ca4744-eb1b-49ee-b3ee-f0ba2eeaf1fa"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39ac6dce-2ced-49a5-b26c-9b3dc76d9f8a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/abe1ff96-adea-445a-b8e6-264e4c10872c"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97d9609f-b8d1-478d-aff6-00606230f171"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a39b041d-cea6-4522-8951-c4018519337d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/126a28e2-ebc0-47e0-baa6-638563eab439"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be46a606-8c08-4010-ba34-17507dbbbc01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b080298a-490c-445a-8dcf-a686541b0426"], "isController": false}, {"data": [0.23770491803278687, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b544fb10-55eb-4db9-85e6-ddd20155ea63"], "isController": false}, {"data": [0.8910614525139665, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed8a471d-3834-4c24-a1d8-6358e25ff7df"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b9fbfe2-1de8-4375-82b8-c34d7e95305a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39ac6dce-2ced-49a5-b26c-9b3dc76d9f8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed8a471d-3834-4c24-a1d8-6358e25ff7df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a25d188d-e017-4ec7-8aa9-78aabc5c493e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edd9fe83-dcbd-4024-9195-dc423b50d3f3"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=126a28e2-ebc0-47e0-baa6-638563eab439"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f503811-77ae-4659-b92d-0115527c49bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03ca4744-eb1b-49ee-b3ee-f0ba2eeaf1fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1358, 36, 2.6509572901325478, 410.0913107511046, 131, 2178, 150.0, 1106.0, 1264.1, 1793.2300000000002, 5.321566844835964, 753.550002228749, 3.9003107512892456], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1995.719298245615, 1609, 2628, 1977.0, 2398.6, 2451.4999999999995, 2628.0, 0.25317467720228654, 304.6546169608712, 1.2448579098764774], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 522.4285714285714, 143, 1144, 474.5, 952.0, 1144.0, 1144.0, 0.07256104197656278, 0.01429355346971354, 0.04882281047055836], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 522.4285714285714, 143, 1144, 474.5, 952.0, 1144.0, 1144.0, 0.07371059115894109, 0.014519999262894089, 0.0495962864340922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 175.6, 132, 421, 141.0, 406.6, 421.0, 421.0, 0.09138930014073952, 0.024453777576721316, 0.05212046023651551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 158.79999999999998, 134, 423, 142.0, 255.0000000000001, 423.0, 423.0, 0.09138261902586128, 0.06791227839714886, 0.04586979119071552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 177.26666666666665, 133, 418, 141.0, 418.0, 418.0, 418.0, 0.0913837324771693, 0.024630771644237038, 0.05381288152708309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 249.73333333333338, 131, 424, 143.0, 422.2, 424.0, 424.0, 0.0913831757481236, 0.024630621588361438, 0.053723312305049224], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 231.86666666666667, 142, 328, 223.0, 306.40000000000003, 328.0, 328.0, 0.07131073892187671, 0.13215699831706657, 0.04609199323023385], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 140.0588235294118, 132, 149, 141.0, 145.8, 149.0, 149.0, 0.15263337463412882, 0.11343163876618363, 0.07661479937689669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 187.58823529411762, 131, 421, 142.0, 400.2, 421.0, 421.0, 0.1526457093086945, 0.05433092916341172, 0.08630164700230765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 815.4444444444445, 658, 986, 696.0, 986.0, 986.0, 986.0, 0.05309483918163154, 15.611645633981876, 0.03028065047077424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1132.7777777777776, 913, 1316, 1250.0, 1316.0, 1316.0, 1316.0, 0.05300571872809833, 47.69463888565783, 0.03017806056492317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 326.44444444444446, 141, 431, 416.0, 431.0, 431.0, 431.0, 0.05318237417936642, 0.09410787305958197, 0.029447662265332773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 143.0, 133, 151, 143.0, 148.3, 151.0, 151.0, 0.08630278853898968, 0.064137130935714, 0.043319954403360054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 155.22222222222223, 132, 414, 141.0, 174.60000000000036, 414.0, 414.0, 0.08630609896432681, 0.03029516386171845, 0.04881876018891446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 214.83333333333334, 133, 1173, 141.0, 489.9000000000011, 1173.0, 1173.0, 0.08629575472828824, 4.335804535620969, 0.050320462880839946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 185.94444444444446, 132, 963, 141.0, 225.00000000000117, 963.0, 963.0, 0.08630651278535091, 1.431802196860361, 0.050411019783370654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a39b041d-cea6-4522-8951-c4018519337d", 3, 0, 0.0, 382.66666666666663, 223, 695, 230.0, 695.0, 695.0, 695.0, 0.024052723570065583, 0.02412319053364976, 0.015424435362314193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 141.33333333333334, 140, 143, 141.0, 143.0, 143.0, 143.0, 0.05326893710714158, 0.039587559705600336, 0.029911756676373448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 845.4374999999999, 132, 1393, 1210.5, 1334.2, 1393.0, 1393.0, 0.07636721173764044, 42.95481335674465, 0.0407938133012591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 219.29411764705878, 132, 928, 141.0, 524.7999999999996, 928.0, 928.0, 0.15264845061822624, 8.118331802172097, 0.08896893267305395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 630.5625000000001, 135, 1131, 705.0, 1127.5, 1131.0, 1131.0, 0.07636794073847798, 14.041912724569476, 0.04086878078582611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 233.35294117647055, 132, 922, 141.0, 525.1999999999996, 922.0, 922.0, 0.15265941684102766, 2.6791341797699335, 0.08912440563852046], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 406.5714285714285, 144, 680, 417.0, 645.5, 680.0, 680.0, 0.0738907156315809, 0.014555481371622799, 0.05019167053713273], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 359.7222222222222, 274, 1313, 286.5, 640.7000000000011, 1313.0, 1313.0, 0.0862337413466836, 5.857639283960523, 0.1927159436606223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b544fb10-55eb-4db9-85e6-ddd20155ea63", 3, 0, 0.0, 367.66666666666663, 219, 664, 220.0, 664.0, 664.0, 664.0, 0.05167068549776094, 0.03321927208921805, 0.03313517266620737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b080298a-490c-445a-8dcf-a686541b0426", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.2656824448529412, 1.0139016544117647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 541.1739130434783, 151, 1186, 451.0, 1069.2000000000003, 1173.9999999999998, 1186.0, 0.09854918461261601, 0.06053460656380417, 0.04455885983949337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 140.06249999999997, 133, 147, 141.0, 146.3, 147.0, 147.0, 0.07636575377771837, 0.056752283813323916, 0.0383320287517063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 208.1875, 133, 429, 142.0, 423.4, 429.0, 429.0, 0.07636757623631947, 0.09212211772061876, 0.039544831346980856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be46a606-8c08-4010-ba34-17507dbbbc01", 3, 0, 0.0, 389.0, 251, 515, 401.0, 515.0, 515.0, 515.0, 0.06773385112099524, 0.03183843783161365, 0.043436095933711144], "isController": false}, {"data": ["login", 23, 0, 0.0, 2559.3913043478265, 1475, 3897, 2664.0, 3141.0, 3747.399999999998, 3897.0, 0.09631208465413493, 45.21488832378239, 0.20780788068398331], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 146.52941176470588, 142, 170, 144.0, 155.6, 170.0, 170.0, 0.14455413552375365, 0.11702673666913259, 0.05138447786195931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f503811-77ae-4659-b92d-0115527c49bb", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a25d188d-e017-4ec7-8aa9-78aabc5c493e", 3, 0, 0.0, 798.0, 254, 1812, 328.0, 1812.0, 1812.0, 1812.0, 0.10729613733905578, 0.04854870797567954, 0.06880644223891273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b9fbfe2-1de8-4375-82b8-c34d7e95305a", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 995.8125, 274, 1540, 1354.5, 1478.4, 1540.0, 1540.0, 0.07631403224267862, 57.10567294965659, 0.15942850925307642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/edd9fe83-dcbd-4024-9195-dc423b50d3f3", 3, 0, 0.0, 337.6666666666667, 256, 465, 292.0, 465.0, 465.0, 465.0, 0.019820819789106478, 0.023427537973387248, 0.012710616856946537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03ca4744-eb1b-49ee-b3ee-f0ba2eeaf1fa", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 411.40000000000003, 276, 842, 288.0, 673.4000000000001, 842.0, 842.0, 0.09130307752239969, 0.1415019375273909, 0.2053427612637563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, 30.76923076923077, 931.6923076923077, 140, 1456, 1122.0, 1439.6, 1456.0, 1456.0, 0.0765002883472407, 63.36694963191592, 0.1350191011657467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39ac6dce-2ced-49a5-b26c-9b3dc76d9f8a", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abe1ff96-adea-445a-b8e6-264e4c10872c", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.5430883290816327, 1.0147613732993197], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 944.5416666666667, 153, 1877, 894.0, 1806.0, 1862.75, 1877.0, 0.09960614071857529, 0.03083510410916833, 0.044939489269513466], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/97d9609f-b8d1-478d-aff6-00606230f171", 2, 0, 0.0, 264.5, 215, 314, 264.5, 314.0, 314.0, 314.0, 0.023234200743494422, 0.026751096363847583, 0.014441961692611525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a39b041d-cea6-4522-8951-c4018519337d", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 160.70588235294116, 142, 417, 145.0, 201.7999999999998, 417.0, 417.0, 0.07992064350221662, 0.06204776521900607, 0.028409291244928563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 426.5882352941176, 274, 1068, 291.0, 667.1999999999996, 1068.0, 1068.0, 0.1524403913234516, 10.950102953308404, 0.3405477009523041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 406.7368421052632, 276, 953, 287.0, 838.0, 953.0, 953.0, 0.1385435427771418, 0.2147154320188711, 0.3115876748200757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 167.0, 134, 422, 142.0, 367.6000000000002, 422.0, 422.0, 0.05395065966942959, 0.04009419141448821, 0.027080702216881653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 215.45454545454547, 133, 432, 142.0, 430.6, 432.0, 432.0, 0.05395092427742546, 0.014436087160170485, 0.030768886501969208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 214.9090909090909, 132, 425, 142.0, 423.4, 425.0, 425.0, 0.05395065966942959, 0.014541388739025947, 0.03171708703222326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 191.8181818181818, 139, 423, 142.0, 420.8, 423.0, 423.0, 0.05395065966942959, 0.014541388739025947, 0.03176977322330669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 144.5, 144, 145, 144.5, 145.0, 145.0, 145.0, 0.021935837674801208, 0.006469358376748012, 0.013559946531395669], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1334.877192982456, 1053, 2036, 1130.0, 1807.8000000000002, 1867.0999999999995, 2036.0, 0.2433682161109759, 291.15299495010953, 0.4805571611097591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 944.5416666666667, 153, 1877, 894.0, 1806.0, 1862.75, 1877.0, 0.0961854455389992, 0.02977615843345971, 0.043396167811540654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 142.0, 133, 147, 144.0, 147.0, 147.0, 147.0, 0.0357610304898546, 0.00963871524921862, 0.02105849744666242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 143.6, 139, 147, 144.0, 147.0, 147.0, 147.0, 0.03575949593414531, 0.009638301638500104, 0.021022672414409645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 272.6470588235294, 136, 1266, 142.0, 1033.9999999999998, 1266.0, 1266.0, 0.08225713580653121, 8.727223165423938, 0.047526555143732246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 253.8823529411764, 131, 995, 141.0, 755.7999999999997, 995.0, 995.0, 0.08225594178214755, 2.864971428156693, 0.047606193328075405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/126a28e2-ebc0-47e0-baa6-638563eab439", 3, 0, 0.0, 456.3333333333333, 219, 643, 507.0, 643.0, 643.0, 643.0, 0.033301511888639744, 0.027762100243101037, 0.021355461725462335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 141.76470588235296, 133, 145, 142.0, 144.2, 145.0, 145.0, 0.08225355383737021, 0.06112788522484251, 0.04128742839102372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 142.8, 140, 145, 142.0, 145.0, 145.0, 145.0, 0.03575924018766449, 0.009568390440839913, 0.020393941669527405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 206.52941176470588, 135, 425, 143.0, 422.6, 425.0, 425.0, 0.08225434980355725, 0.03654383854438832, 0.04609796855948441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 144.2, 142, 146, 144.0, 146.0, 146.0, 146.0, 0.03575719434750271, 0.026573461814892157, 0.017948435443961325], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 533.2142857142859, 140, 1812, 449.5, 1253.5, 1812.0, 1812.0, 0.07450454477723141, 0.014385364114353833, 0.05070217207356792], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 255.0, 144, 420, 149.0, 420.0, 420.0, 420.0, 0.035331943610218, 0.027810104052573933, 0.01255940183019468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1221.0434782608697, 733, 2178, 1095.0, 1737.2000000000003, 2110.399999999999, 2178.0, 0.096722779896801, 0.05006159506377395, 0.04448870051893874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 289.0, 282, 295, 289.0, 295.0, 295.0, 295.0, 0.03572143000028577, 0.05536123965864601, 0.08033833329165832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be46a606-8c08-4010-ba34-17507dbbbc01", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b080298a-490c-445a-8dcf-a686541b0426", 3, 0, 0.0, 329.0, 255, 450, 282.0, 450.0, 450.0, 450.0, 0.02657360001417259, 0.03140909558966818, 0.01704101302992187], "isController": false}, {"data": ["addBook", 61, 18, 29.508196721311474, 1210.426229508197, 711, 2712, 1088.0, 1928.4, 2096.1, 2712.0, 0.2830547641364974, 78.8683450228764, 1.029150399234824], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 275.2105263157896, 132, 588, 144.0, 569.2, 572.4, 588.0, 0.24437718117352497, 0.1816123387432153, 0.11813154753993638], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 820.9298245614036, 652, 1146, 709.0, 1063.8000000000002, 1128.5, 1146.0, 0.2440475935622814, 71.75809565006571, 0.12273877996540518], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 215.2631578947369, 133, 428, 144.0, 424.0, 425.1, 428.0, 0.24458270757348208, 0.4327967442608882, 0.11894744958163483], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1054.4561403508774, 912, 1414, 979.0, 1262.4, 1294.9999999999993, 1414.0, 0.2440162506260943, 219.56625124817523, 0.12248471955255125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 146.84210526315786, 141, 155, 146.0, 154.0, 155.0, 155.0, 0.14296571080294057, 0.10680543824633744, 0.050819842511982787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b544fb10-55eb-4db9-85e6-ddd20155ea63", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 18, 10.05586592178771, 196.02234636871503, 133, 976, 146.0, 359.0, 411.0, 684.7999999999959, 0.7278937844377122, 1.5934589949779396, 0.34872154758758106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 148.54545454545453, 142, 159, 148.0, 158.6, 159.0, 159.0, 0.05260464738148412, 0.0407377786850751, 0.018699308248886933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed8a471d-3834-4c24-a1d8-6358e25ff7df", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b9fbfe2-1de8-4375-82b8-c34d7e95305a", 3, 0, 0.0, 665.0, 240, 1293, 462.0, 1293.0, 1293.0, 1293.0, 0.03032048755343986, 0.03040931710681908, 0.019443802239673347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 146.73333333333335, 138, 168, 144.0, 160.20000000000002, 168.0, 168.0, 0.0983574309039048, 0.07981936043080555, 0.03496299301662241], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39ac6dce-2ced-49a5-b26c-9b3dc76d9f8a", 3, 0, 0.0, 298.6666666666667, 235, 419, 242.0, 419.0, 419.0, 419.0, 0.026855250201414375, 0.026933927692238836, 0.017221628547130965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed8a471d-3834-4c24-a1d8-6358e25ff7df", 3, 0, 0.0, 324.0, 222, 446, 304.0, 446.0, 446.0, 446.0, 0.09172909341079345, 0.0415050259899098, 0.05882366992814555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a25d188d-e017-4ec7-8aa9-78aabc5c493e", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edd9fe83-dcbd-4024-9195-dc423b50d3f3", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 437.8181818181818, 278, 854, 287.0, 797.2000000000003, 854.0, 854.0, 0.05391311166875784, 0.08355479318195184, 0.12125185173159111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 465.9411764705882, 277, 1407, 287.0, 1193.3999999999999, 1407.0, 1407.0, 0.0821966821551003, 11.681320479122043, 0.18238805386058476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=126a28e2-ebc0-47e0-baa6-638563eab439", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 162.33333333333334, 138, 434, 144.0, 191.90000000000038, 434.0, 434.0, 0.08659341505185984, 0.07179473572170801, 0.0307812530067158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f503811-77ae-4659-b92d-0115527c49bb", 3, 0, 0.0, 705.6666666666666, 271, 1433, 413.0, 1433.0, 1433.0, 1433.0, 0.01655400744930335, 0.022821035660091048, 0.010615688370809766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 164.375, 142, 430, 145.5, 238.9000000000002, 430.0, 430.0, 0.07366652086834412, 0.05719226961946638, 0.026186146089919198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03ca4744-eb1b-49ee-b3ee-f0ba2eeaf1fa", 3, 0, 0.0, 296.0, 216, 449, 223.0, 449.0, 449.0, 449.0, 0.03434852301351042, 0.02829951554270666, 0.022026884875200367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 169.05263157894737, 132, 415, 142.0, 398.0, 415.0, 415.0, 0.13868916837594986, 0.1030688057950174, 0.06961546146995919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 182.8421052631579, 132, 420, 141.0, 418.0, 420.0, 420.0, 0.1386932179016446, 0.0371112711963385, 0.0790984758345317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 213.15789473684208, 133, 422, 141.0, 418.0, 422.0, 422.0, 0.13869625520110956, 0.03738297503467406, 0.0815382281553398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 190.63157894736847, 132, 554, 142.0, 426.0, 554.0, 554.0, 0.13869018073520395, 0.03738133777628544, 0.08167009666340623], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 27.77777777777778, 0.7363770250368189], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.555555555555555, 0.14727540500736377], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.555555555555555, 0.14727540500736377], "isController": false}, {"data": ["401/Unauthorized", 22, 61.111111111111114, 1.6200294550810015], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1358, 36, "401/Unauthorized", 22, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 98.3739837398374, "KoPercent": 1.6260162601626016};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8152724968314322, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3644067796610169, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/208e0d2d-4f1f-4878-b154-65920fae2d87"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5136778-8835-40a6-8fc9-026cfdba3a55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b6bd6f7-61a3-43d1-bce0-cbf2753e71ff"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39e79f47-4604-4295-9064-a958f305b5d0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4acb058f-a203-4b18-a3e5-bd4b9add0cd9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12ee9749-df38-4dcf-969e-d0012a58b2eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fcc25e50-07be-4839-9f6a-0d63b4decd0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75d3ce46-89a9-46bf-85e1-d9ce74e68b44"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=159ab647-28aa-46a1-812b-5f0d323c190d"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39e79f47-4604-4295-9064-a958f305b5d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4acb058f-a203-4b18-a3e5-bd4b9add0cd9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a4affff4-773d-46f9-a125-ee7e971fee4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fd1f864-e382-4d70-a5b5-3cebb369f1fb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9629629629629629, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2c3bf69-956c-423a-a8ad-b52edf3a6b2c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1cbc41bb-7c4f-4159-8006-f44435472812"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=892712ec-879a-4d64-8a39-62f3a5fa0eee"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fcc25e50-07be-4839-9f6a-0d63b4decd0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5b6bd6f7-61a3-43d1-bce0-cbf2753e71ff"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dee5dbcf-773b-4f0f-99b8-8d1d19e01e52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4583333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12ee9749-df38-4dcf-969e-d0012a58b2eb"], "isController": false}, {"data": [0.40350877192982454, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56a63b95-46b7-4f4e-8730-4e3fcde64d34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7711864406779662, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9624277456647399, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4affff4-773d-46f9-a125-ee7e971fee4c"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56a63b95-46b7-4f4e-8730-4e3fcde64d34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75d3ce46-89a9-46bf-85e1-d9ce74e68b44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fd1f864-e382-4d70-a5b5-3cebb369f1fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2c3bf69-956c-423a-a8ad-b52edf3a6b2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1cbc41bb-7c4f-4159-8006-f44435472812"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/892712ec-879a-4d64-8a39-62f3a5fa0eee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/159ab647-28aa-46a1-812b-5f0d323c190d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1353, 22, 1.6260162601626016, 306.6045824094605, 81, 2906, 98.0, 843.6000000000001, 1006.0, 1396.0600000000004, 5.29419360392545, 761.7736838617093, 3.8752751889944945], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1367.5932203389827, 1002, 1937, 1354.0, 1691.0, 1788.0, 1937.0, 0.2549455107984548, 306.78562694720034, 1.253565084834199], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/208e0d2d-4f1f-4878-b154-65920fae2d87", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 594.4, 88, 1272, 446.0, 1260.0, 1272.0, 1272.0, 0.09815212270324032, 0.019227847474873053, 0.06608653990865308], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 594.4, 88, 1272, 446.0, 1260.0, 1272.0, 1272.0, 0.09667813913917785, 0.018939096397772536, 0.065094096027173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5136778-8835-40a6-8fc9-026cfdba3a55", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.7290774828767124, 1.3622823915525115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 27, 0, 0.0, 103.62962962962965, 82, 252, 85.0, 251.0, 251.6, 252.0, 0.15318627450980393, 0.04951072587599855, 0.0868875563101398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 27, 0, 0.0, 99.14814814814814, 83, 256, 86.0, 132.3999999999999, 253.6, 256.0, 0.15318627450980393, 0.11384253408394608, 0.07689232919730392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 27, 0, 0.0, 128.5185185185185, 81, 672, 85.0, 270.19999999999993, 538.7999999999993, 672.0, 0.15318540540233863, 1.7079662970832363, 0.08971828955729418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 27, 0, 0.0, 146.81481481481478, 82, 1063, 86.0, 252.4, 739.3999999999983, 1063.0, 0.15318540540233863, 5.144814505594104, 0.08956869443483095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b6bd6f7-61a3-43d1-bce0-cbf2753e71ff", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 217.33333333333337, 84, 435, 197.0, 397.20000000000005, 435.0, 435.0, 0.09809114629313559, 0.19974576001020147, 0.06340162111967773], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/39e79f47-4604-4295-9064-a958f305b5d0", 3, 0, 0.0, 261.3333333333333, 165, 432, 187.0, 432.0, 432.0, 432.0, 0.12138868657441126, 0.05634774318200211, 0.0778436564295541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4acb058f-a203-4b18-a3e5-bd4b9add0cd9", 3, 0, 0.0, 463.6666666666667, 193, 1002, 196.0, 1002.0, 1002.0, 1002.0, 0.024490995477329504, 0.02894752753196075, 0.0157054886361781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 11, 0, 0.0, 84.72727272727273, 81, 87, 85.0, 87.0, 87.0, 87.0, 0.14821202403729553, 0.1101458498949042, 0.07439548862809561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 11, 0, 0.0, 113.9090909090909, 82, 250, 84.0, 249.6, 250.0, 250.0, 0.1482220096209559, 0.0598993774675596, 0.08340119824020051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 551.25, 488, 744, 503.0, 744.0, 744.0, 744.0, 0.09698380370478131, 28.51645845456309, 0.05531107555038309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 819.0, 579, 1090, 869.5, 1090.0, 1090.0, 1090.0, 0.09650763013450751, 86.83773523734845, 0.054945262078533084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 205.75, 86, 325, 250.0, 325.0, 325.0, 325.0, 0.09728336211299463, 0.17214594936401004, 0.05386686163873824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 85.41666666666667, 83, 88, 85.0, 87.7, 88.0, 88.0, 0.07313906784258034, 0.05435432678535512, 0.036712383663170214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 84.33333333333333, 82, 87, 84.0, 86.7, 87.0, 87.0, 0.07314040519784479, 0.019570772484579564, 0.041712887339395856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 141.0, 82, 252, 87.5, 252.0, 252.0, 252.0, 0.07314040519784479, 0.019713624838481603, 0.04299855852451422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 140.75, 84, 254, 86.0, 253.4, 254.0, 254.0, 0.07306692321275261, 0.01969381914718723, 0.043026713571572096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12ee9749-df38-4dcf-969e-d0012a58b2eb", 3, 0, 0.0, 329.0, 215, 502, 270.0, 502.0, 502.0, 502.0, 0.015932869509798716, 0.021964746866535663, 0.010217367491635244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 85.5, 83, 88, 85.5, 88.0, 88.0, 88.0, 0.09747895063909637, 0.07244285296518782, 0.05473671544675821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 645.5333333333331, 84, 1248, 824.0, 1092.6000000000001, 1248.0, 1248.0, 0.07144354055135362, 42.86310100390082, 0.03790786819619349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 11, 0, 0.0, 175.72727272727272, 83, 914, 85.0, 781.8000000000005, 914.0, 914.0, 0.14657871943500567, 12.026078623659137, 0.08502710873475915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 468.13333333333355, 82, 748, 662.0, 745.0, 748.0, 748.0, 0.07144388083160677, 14.011000869233882, 0.037977818163415965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 11, 0, 0.0, 170.36363636363637, 82, 670, 85.0, 590.6000000000004, 670.0, 670.0, 0.14705685752864267, 3.966905731541022, 0.08544807639603748], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 532.6, 92, 2906, 388.0, 1566.8000000000006, 2906.0, 2906.0, 0.0968998507742298, 0.018982529360654785, 0.06588685165924844], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fcc25e50-07be-4839-9f6a-0d63b4decd0d", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 254.91666666666669, 169, 340, 255.5, 339.4, 340.0, 340.0, 0.07302779316094718, 0.11317881615861637, 0.1642412184078724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75d3ce46-89a9-46bf-85e1-d9ce74e68b44", 3, 0, 0.0, 627.6666666666666, 277, 1258, 348.0, 1258.0, 1258.0, 1258.0, 0.05593049703568365, 0.025307093385286552, 0.03586688774749245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 521.125, 112, 1702, 415.5, 1213.5, 1592.75, 1702.0, 0.10208639060805205, 0.06270736298092261, 0.04615820200344541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 86.0, 83, 92, 86.0, 90.2, 92.0, 92.0, 0.07144251973004254, 0.05309351319781481, 0.035860796036369005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 164.73333333333332, 84, 261, 86.0, 259.2, 261.0, 261.0, 0.07144388083160677, 0.09065372639375104, 0.03674522516729775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=159ab647-28aa-46a1-812b-5f0d323c190d", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["login", 24, 0, 0.0, 2347.6666666666665, 1458, 3884, 2106.5, 3564.0, 3866.5, 3884.0, 0.09863067742836948, 39.464824550408494, 0.20332945317508588], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 11, 0, 0.0, 92.18181818181817, 86, 100, 93.0, 99.6, 100.0, 100.0, 0.1460067163089502, 0.11820270294933567, 0.05190082493794715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39e79f47-4604-4295-9064-a958f305b5d0", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 0.5827872983870968, 2.2240423387096775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4acb058f-a203-4b18-a3e5-bd4b9add0cd9", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4affff4-773d-46f9-a125-ee7e971fee4c", 3, 0, 0.0, 378.0, 165, 534, 435.0, 534.0, 534.0, 534.0, 0.026682320294572816, 0.02676049115481082, 0.017110732740985825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fd1f864-e382-4d70-a5b5-3cebb369f1fb", 3, 0, 0.0, 250.33333333333334, 174, 377, 200.0, 377.0, 377.0, 377.0, 0.06485645105499828, 0.02934585513230716, 0.0415908882090972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 732.7333333333333, 171, 1335, 911.0, 1179.6000000000001, 1335.0, 1335.0, 0.07141292859659314, 56.99335186548423, 0.14842823863582263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 27, 0, 0.0, 268.44444444444446, 169, 1319, 175.0, 439.79999999999995, 992.5999999999983, 1319.0, 0.15310809431458608, 7.012592166110941, 0.3428927984615472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 638.9166666666667, 84, 1174, 792.5, 1120.6000000000001, 1174.0, 1174.0, 0.14461490256570939, 115.35269842369756, 0.24933360398414056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2c3bf69-956c-423a-a8ad-b52edf3a6b2c", 3, 0, 0.0, 324.0, 197, 485, 290.0, 485.0, 485.0, 485.0, 0.03221372734301176, 0.02685525902521261, 0.020657891557855853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1cbc41bb-7c4f-4159-8006-f44435472812", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 0.26804757047477745, 1.0229274851632046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=892712ec-879a-4d64-8a39-62f3a5fa0eee", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["register", 25, 8, 32.0, 884.32, 117, 1557, 942.0, 1404.8, 1512.6, 1557.0, 0.10202957225122129, 0.031932067690499416, 0.046032873418031486], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fcc25e50-07be-4839-9f6a-0d63b4decd0d", 3, 0, 0.0, 529.3333333333334, 372, 827, 389.0, 827.0, 827.0, 827.0, 0.02021576964804345, 0.027869070462065108, 0.012963888739142447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 88.76470588235293, 85, 110, 87.0, 95.6, 110.0, 110.0, 0.10599693232407627, 0.08229254023207093, 0.037678597037073984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 11, 0, 0.0, 324.09090909090907, 169, 998, 332.0, 870.6000000000005, 998.0, 998.0, 0.14640703818561748, 16.129340012045308, 0.3258674409047955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b6bd6f7-61a3-43d1-bce0-cbf2753e71ff", 3, 0, 0.0, 544.3333333333334, 174, 845, 614.0, 845.0, 845.0, 845.0, 0.018102168639803046, 0.024955300842957655, 0.011608487050915366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 309.47058823529414, 170, 1087, 173.0, 619.7999999999996, 1087.0, 1087.0, 0.08381651086656411, 6.020710227832998, 0.18724381267749377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 85.44444444444444, 83, 88, 86.0, 88.0, 88.0, 88.0, 0.049089124031853386, 0.036481272840078544, 0.024640439211301407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 122.33333333333333, 84, 254, 86.0, 254.0, 254.0, 254.0, 0.049088856284191754, 0.013135104122918495, 0.02799598834957811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 149.88888888888889, 83, 339, 85.0, 339.0, 339.0, 339.0, 0.049044717883883905, 0.013219084117140584, 0.02883292984970519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 121.55555555555556, 83, 252, 85.0, 252.0, 252.0, 252.0, 0.049088856284191754, 0.013230980795348558, 0.028906816737663696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 0.12008405884118883, 0.035415415791053735, 0.07423164965475833], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 939.3898305084745, 652, 1573, 914.0, 1283.0, 1430.0, 1573.0, 0.2673275850350924, 319.81672980770537, 0.5278675556064032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 884.32, 117, 1557, 942.0, 1404.8, 1512.6, 1557.0, 0.09782323732308668, 0.030615616305959784, 0.044135093401626996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 85.875, 83, 88, 86.0, 88.0, 88.0, 88.0, 0.04439068239576512, 0.01196467611448357, 0.026140216293599975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 127.375, 85, 248, 86.5, 248.0, 248.0, 248.0, 0.04435007733544735, 0.011953731781819793, 0.026072994683534478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 173.76470588235293, 81, 925, 86.0, 389.7999999999995, 925.0, 925.0, 0.10050845453470499, 5.345360398560365, 0.058579893135863786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 138.2941176470588, 83, 664, 85.0, 331.9999999999997, 664.0, 664.0, 0.10061136198192547, 1.7657039725212613, 0.05873812453023371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dee5dbcf-773b-4f0f-99b8-8d1d19e01e52", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.7002981085526315, 1.308508086622807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 106.625, 84, 255, 85.5, 255.0, 255.0, 255.0, 0.04439043608054645, 0.011877909654364967, 0.025316420577186645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 97.23529411764707, 83, 253, 87.0, 131.3999999999999, 253.0, 253.0, 0.10060778941014245, 0.07476809349718594, 0.05050039429376291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 86.12499999999999, 84, 88, 86.0, 88.0, 88.0, 88.0, 0.04438945084700621, 0.0329886446236052, 0.022281423569688662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 134.82352941176472, 84, 256, 86.0, 254.4, 256.0, 256.0, 0.10050845453470499, 0.03577380424500414, 0.05682469034527611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 133.75, 87, 254, 97.0, 254.0, 254.0, 254.0, 0.043580343086250944, 0.034302496608904554, 0.015491450081440768], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 433.00000000000006, 85, 1002, 419.0, 769.2000000000002, 1002.0, 1002.0, 0.10126513913830118, 0.01946848671063824, 0.06891435543051186], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1252.9583333333335, 797, 2829, 1122.5, 1753.0, 2636.75, 2829.0, 0.09925229934493483, 0.0513708189968901, 0.04565218065572686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 216.125, 172, 342, 175.0, 342.0, 342.0, 342.0, 0.04432845166259399, 0.06870044217630533, 0.09969572673725972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12ee9749-df38-4dcf-969e-d0012a58b2eb", 1, 0, 0.0, 2906.0, 2906, 2906, 2906.0, 2906.0, 2906.0, 2906.0, 0.3441156228492773, 0.06216932639366827, 0.23725159153475567], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 873.2456140350877, 439, 1782, 726.0, 1464.6000000000001, 1574.6999999999994, 1782.0, 0.2657416990685054, 79.1248230938278, 0.967256441322368], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56a63b95-46b7-4f4e-8730-4e3fcde64d34", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 142.3220338983051, 83, 401, 87.0, 345.0, 349.0, 401.0, 0.26824034334763946, 0.19934658328862662, 0.12966696284871246], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 528.0677966101696, 404, 769, 498.0, 671.0, 675.0, 769.0, 0.26810138776548853, 78.83070980694428, 0.13483614716721348], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 142.49152542372883, 83, 344, 89.0, 256.0, 263.0, 344.0, 0.26860548228341974, 0.47530579482183266, 0.13063040056361624], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 794.7288135593219, 565, 1176, 756.0, 958.0, 1084.0, 1176.0, 0.2677947330676567, 240.96217154720676, 0.13442040312185113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 98.23529411764706, 85, 254, 88.0, 129.9999999999999, 254.0, 254.0, 0.08402281466544091, 0.06277095040924054, 0.029867484900605954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 6, 3.468208092485549, 136.6820809248555, 84, 699, 91.0, 246.2, 285.29999999999995, 549.5199999999982, 0.7438652614922884, 1.6584669831856353, 0.3548720016962708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 108.22222222222221, 85, 268, 86.0, 268.0, 268.0, 268.0, 0.04939518342078111, 0.038252324660819736, 0.017558444106605783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 27, 0, 0.0, 96.55555555555556, 85, 259, 89.0, 98.99999999999999, 199.79999999999967, 259.0, 0.14870543656060847, 0.12067794705260317, 0.05286013565240379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 292.3333333333333, 169, 424, 338.0, 424.0, 424.0, 424.0, 0.049022010882886415, 0.07597454225697338, 0.11025165142899161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4affff4-773d-46f9-a125-ee7e971fee4c", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 301.11764705882354, 169, 1026, 178.0, 611.5999999999997, 1026.0, 1026.0, 0.10045500206819122, 7.215886847781126, 0.22441375088636767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56a63b95-46b7-4f4e-8730-4e3fcde64d34", 3, 0, 0.0, 275.0, 188, 373, 264.0, 373.0, 373.0, 373.0, 0.04218993910585456, 0.02712406566864022, 0.027055397147960118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75d3ce46-89a9-46bf-85e1-d9ce74e68b44", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 104.75, 85, 256, 88.5, 215.80000000000013, 256.0, 256.0, 0.07222693703616763, 0.059883466351275706, 0.025674419024575214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 112.60000000000001, 85, 256, 91.0, 255.4, 256.0, 256.0, 0.07047845473638709, 0.0547171596830349, 0.0250528882070751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fd1f864-e382-4d70-a5b5-3cebb369f1fb", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2c3bf69-956c-423a-a8ad-b52edf3a6b2c", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1cbc41bb-7c4f-4159-8006-f44435472812", 3, 0, 0.0, 287.0, 173, 409, 279.0, 409.0, 409.0, 409.0, 0.030875632950475483, 0.025277414345848258, 0.019799803682433822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/892712ec-879a-4d64-8a39-62f3a5fa0eee", 3, 0, 0.0, 339.6666666666667, 165, 435, 419.0, 435.0, 435.0, 435.0, 0.032898704887650926, 0.03299508781212646, 0.021097151246312604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/159ab647-28aa-46a1-812b-5f0d323c190d", 3, 0, 0.0, 302.6666666666667, 208, 441, 259.0, 441.0, 441.0, 441.0, 0.023348302189292472, 0.027596902750429995, 0.01497270680758664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 105.58823529411765, 84, 252, 86.0, 250.4, 252.0, 252.0, 0.08385206522704179, 0.062315841443143366, 0.04208980617841746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 133.41176470588235, 82, 255, 85.0, 253.4, 255.0, 255.0, 0.08385206522704179, 0.029845323767621265, 0.04740763016800008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 183.1764705882353, 84, 1002, 85.0, 473.19999999999953, 1002.0, 1002.0, 0.0838524788272491, 4.459542450625688, 0.04887219957383211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 138.05882352941177, 83, 659, 86.0, 331.7999999999997, 659.0, 659.0, 0.08385206522704179, 1.471582550508538, 0.04895384529540589], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 36.36363636363637, 0.5912786400591279], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.14781966001478197], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.14781966001478197], "isController": false}, {"data": ["401/Unauthorized", 10, 45.45454545454545, 0.7390983000739099], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1353, 22, "401/Unauthorized", 10, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

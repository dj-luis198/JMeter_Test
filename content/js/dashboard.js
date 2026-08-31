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

    var data = {"OkPercent": 98.3023443815683, "KoPercent": 1.6976556184316896};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7245322245322245, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f928ab58-3906-4333-96b4-b4a23e101dc5"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb451da4-b30f-4249-a268-b912f81ee09b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4b632bc-b800-4d5e-b629-348b01f858ce"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80275334-21da-41d3-ac87-014636d7f0c3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d14f86b-f619-4c09-8e66-e4dd4facd643"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d14f86b-f619-4c09-8e66-e4dd4facd643"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e83db85b-998d-4b5b-a7ac-344a9157f099"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f1c07e2-1bf5-48b5-8820-5d5e34bd27eb"], "isController": false}, {"data": [0.475, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/768d678f-a373-4f3a-84e7-055bb6a310e0"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7b3a9b07-5ac2-4b52-a29a-06ddbde1e025"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82e28206-e2fb-40d0-9237-183ceb8afc38"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87e96dd1-9e7b-4a3e-a59e-446dc00a1eb5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1820ae35-f834-4c75-9611-b0ae838ed638"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f928ab58-3906-4333-96b4-b4a23e101dc5"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebbe106c-8ed7-4f84-bdb2-abaa5ea24d9d"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "register"], "isController": true}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cb3e1e29-1c01-46cb-bad6-635307788b6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bb451da4-b30f-4249-a268-b912f81ee09b"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.27358490566037735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.075, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/eb8171a2-f75c-421b-a467-79dd5b8ab177"], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3867924528301887, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9030303030303031, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/571a7a1f-4336-4664-9b04-349a7ce101da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82e28206-e2fb-40d0-9237-183ceb8afc38"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80275334-21da-41d3-ac87-014636d7f0c3"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1820ae35-f834-4c75-9611-b0ae838ed638"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87e96dd1-9e7b-4a3e-a59e-446dc00a1eb5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b3a9b07-5ac2-4b52-a29a-06ddbde1e025"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e83db85b-998d-4b5b-a7ac-344a9157f099"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb3e1e29-1c01-46cb-bad6-635307788b6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebbe106c-8ed7-4f84-bdb2-abaa5ea24d9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=768d678f-a373-4f3a-84e7-055bb6a310e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f1c07e2-1bf5-48b5-8820-5d5e34bd27eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1237, 21, 1.6976556184316896, 465.8763136620849, 125, 3469, 145.0, 1314.4000000000005, 1563.8999999999992, 2065.199999999999, 4.834259541507413, 676.378181947636, 3.5275163148931927], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/f928ab58-3906-4333-96b4-b4a23e101dc5", 3, 0, 0.0, 906.0, 291, 1900, 527.0, 1900.0, 1900.0, 1900.0, 0.021473205019003787, 0.021536114799332897, 0.013770251916483548], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2136.9433962264147, 1543, 2793, 2152.0, 2569.0, 2659.4999999999995, 2793.0, 0.24098248102831318, 289.98438498173306, 1.184908976540583], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb451da4-b30f-4249-a268-b912f81ee09b", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4b632bc-b800-4d5e-b629-348b01f858ce", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 657.5714285714286, 132, 1498, 628.0, 1150.5, 1498.0, 1498.0, 0.07071814273951983, 0.01335337698073941, 0.04782452524132566], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 657.5714285714286, 132, 1498, 628.0, 1150.5, 1498.0, 1498.0, 0.07166000399248594, 0.013531224247186066, 0.048461477309371594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 147.38888888888889, 127, 379, 129.0, 226.90000000000023, 379.0, 379.0, 0.13586341198315294, 0.036354077034554594, 0.07748460214664192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 145.83333333333337, 128, 392, 130.0, 165.20000000000036, 392.0, 392.0, 0.1358593101366141, 0.10096575684957354, 0.06819500528341761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 166.61111111111114, 127, 424, 130.0, 386.20000000000005, 424.0, 424.0, 0.1358644374834887, 0.03661971166547156, 0.08000610918217156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 189.22222222222226, 126, 395, 130.5, 384.20000000000005, 395.0, 395.0, 0.13586238649829793, 0.03661915886086937, 0.07987222331247594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80275334-21da-41d3-ac87-014636d7f0c3", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 288.64285714285717, 128, 570, 243.5, 521.0, 570.0, 570.0, 0.07112411666387251, 0.13180485542753215, 0.04597566888421502], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 141.08695652173913, 127, 388, 129.0, 134.0, 337.19999999999925, 388.0, 0.12913368143282242, 0.09596751129919712, 0.06481905493795968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 155.26086956521735, 126, 420, 129.0, 310.00000000000034, 415.99999999999994, 420.0, 0.12913440645896612, 0.04298631736745476, 0.07317543260026163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 950.5, 759, 1019, 1012.0, 1019.0, 1019.0, 1019.0, 0.02299828662764624, 6.7622598835136785, 0.013116210342329498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1323.75, 1139, 1390, 1383.0, 1390.0, 1390.0, 1390.0, 0.022948938611589212, 20.649495302639128, 0.013065655479059093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 288.75, 128, 515, 256.0, 515.0, 515.0, 515.0, 0.023115508194447656, 0.0409036141097062, 0.012799309713136543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 151.15384615384613, 128, 390, 130.0, 291.5999999999999, 390.0, 390.0, 0.07115411982353778, 0.05287918475167212, 0.03571603280204924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 168.4615384615385, 128, 382, 129.0, 380.8, 382.0, 382.0, 0.07115022549148386, 0.01903824393033846, 0.040577862975611896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 168.15384615384613, 127, 389, 129.0, 387.8, 389.0, 389.0, 0.07105455896981822, 0.019151424097333815, 0.041772309081865786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 149.3846153846154, 127, 381, 129.0, 285.3999999999999, 381.0, 381.0, 0.07114944667622623, 0.019176999299451603, 0.04189757455641056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 195.5, 129, 394, 129.5, 394.0, 394.0, 394.0, 0.023115241034175883, 0.01717841643262485, 0.012979749604151498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d14f86b-f619-4c09-8e66-e4dd4facd643", 1, 0, 0.0, 937.0, 937, 937, 937.0, 937.0, 937.0, 937.0, 1.0672358591248667, 0.19281116595517608, 0.735809098185699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 834.0, 126, 1819, 765.0, 1670.5000000000002, 1819.0, 1819.0, 0.09007386056566384, 40.53644789508647, 0.0490832169879301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 210.30434782608697, 127, 1442, 129.0, 392.4, 1232.399999999997, 1442.0, 0.1291351314932513, 5.085293447304444, 0.07543483097334201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 571.3333333333334, 127, 1137, 447.0, 1128.9, 1137.0, 1137.0, 0.09007295909686847, 13.25435907772796, 0.04917068763198191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 204.26086956521735, 126, 1011, 129.0, 393.8, 888.9999999999983, 1011.0, 0.1291315064032384, 1.6841156491946123, 0.07555881834846417], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 536.4285714285714, 131, 1268, 503.5, 1102.5, 1268.0, 1268.0, 0.07174483437192522, 0.013547242371986717, 0.04909937011878895], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 359.69230769230774, 257, 779, 261.0, 676.5999999999999, 779.0, 779.0, 0.07100371950253702, 0.11004189731496704, 0.15968902931088158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d14f86b-f619-4c09-8e66-e4dd4facd643", 3, 0, 0.0, 426.0, 236, 749, 293.0, 749.0, 749.0, 749.0, 0.02872407652093985, 0.023946080719442372, 0.01842006209187875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e83db85b-998d-4b5b-a7ac-344a9157f099", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f1c07e2-1bf5-48b5-8820-5d5e34bd27eb", 3, 0, 0.0, 402.3333333333333, 228, 651, 328.0, 651.0, 651.0, 651.0, 0.11628357688282491, 0.052615290321330284, 0.07456987189425947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 1054.25, 305, 2910, 958.5, 1994.900000000001, 2866.7499999999995, 2910.0, 0.08613820875594892, 0.05291106768309753, 0.03894725649805112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 144.5, 128, 383, 129.5, 160.70000000000036, 383.0, 383.0, 0.09007656508031826, 0.06694166604113497, 0.04521421333133163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 186.8888888888889, 127, 386, 131.0, 385.1, 386.0, 386.0, 0.09007340982901064, 0.09174469380044736, 0.047587612028803475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/768d678f-a373-4f3a-84e7-055bb6a310e0", 3, 0, 0.0, 366.3333333333333, 238, 469, 392.0, 469.0, 469.0, 469.0, 0.09622169478478415, 0.04353781111681314, 0.061704667554044516], "isController": false}, {"data": ["login", 20, 0, 0.0, 3652.7, 2453, 6044, 3419.0, 5017.6, 5993.999999999999, 6044.0, 0.08619277876899473, 20.742881419207198, 0.1586317488945776], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 166.34782608695653, 130, 533, 136.0, 292.8000000000003, 503.1999999999996, 533.0, 0.1277479699181302, 0.10342096392786128, 0.04541041118183535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b3a9b07-5ac2-4b52-a29a-06ddbde1e025", 3, 0, 0.0, 682.0, 271, 1218, 557.0, 1218.0, 1218.0, 1218.0, 0.027401264111651016, 0.022843306442037192, 0.017571774186182457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82e28206-e2fb-40d0-9237-183ceb8afc38", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87e96dd1-9e7b-4a3e-a59e-446dc00a1eb5", 3, 0, 0.0, 326.6666666666667, 227, 511, 242.0, 511.0, 511.0, 511.0, 0.09231053263177329, 0.04170801409274131, 0.059196532970245234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1820ae35-f834-4c75-9611-b0ae838ed638", 3, 0, 0.0, 576.6666666666666, 526, 634, 570.0, 634.0, 634.0, 634.0, 0.024075114356793197, 0.024145646918385364, 0.015438794037396678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 980.0555555555557, 261, 1954, 1022.0, 1800.1000000000001, 1954.0, 1954.0, 0.0900135020253038, 53.913472763101964, 0.19092707656148422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f928ab58-3906-4333-96b4-b4a23e101dc5", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1056.1666666666667, 128, 1777, 1392.0, 1777.0, 1777.0, 1777.0, 0.03439755548039053, 27.437357930929707, 0.05930555097717722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 370.8888888888889, 259, 776, 267.5, 576.2000000000003, 776.0, 776.0, 0.1357251114076956, 0.21034741387110636, 0.30524895661320606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebbe106c-8ed7-4f84-bdb2-abaa5ea24d9d", 2, 0, 0.0, 353.5, 235, 472, 353.5, 472.0, 472.0, 472.0, 0.024839166397575697, 0.028259403176929383, 0.015439579503961846], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1549.6363636363637, 545, 3469, 1459.0, 2910.5999999999995, 3423.8499999999995, 3469.0, 0.09258401999814833, 0.029129773337485586, 0.04177130589760207], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 388.9565217391305, 257, 1572, 261.0, 693.4000000000003, 1415.3999999999978, 1572.0, 0.12903732544896573, 6.903179139573504, 0.288772516662646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 180.27272727272725, 130, 400, 135.0, 391.0, 400.0, 400.0, 0.07365643958163141, 0.05718444283925486, 0.026182562507533043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 614.7500000000001, 258, 1610, 392.0, 1533.0, 1610.0, 1610.0, 0.07985546161447779, 18.013347988578175, 0.1757658481897765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb3e1e29-1c01-46cb-bad6-635307788b6e", 3, 0, 0.0, 495.3333333333333, 384, 556, 546.0, 556.0, 556.0, 556.0, 0.03434223178716975, 0.028629705601218008, 0.022022850462475388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 132.0, 131, 133, 132.0, 133.0, 133.0, 133.0, 0.02378845403594911, 0.01767872414195046, 0.011940688842263519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 132.2, 129, 137, 131.0, 137.0, 137.0, 137.0, 0.023787774986678847, 0.01351071282446525, 0.013166905139110908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb451da4-b30f-4249-a268-b912f81ee09b", 3, 0, 0.0, 1135.0, 231, 2379, 795.0, 2379.0, 2379.0, 2379.0, 0.01667574568376116, 0.022988861644117356, 0.010693756183922359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 383.2, 129, 1392, 130.0, 1392.0, 1392.0, 1392.0, 0.023646699393698626, 4.260567155739527, 0.013495245239919412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 307.2, 130, 1009, 132.0, 1009.0, 1009.0, 1009.0, 0.023689609263584807, 1.3982144105077632, 0.013542868420803269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 2.2513120229007635, 4.71880963740458], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1476.150943396227, 1007, 2233, 1396.0, 2025.4, 2110.9999999999995, 2233.0, 0.23939005221413212, 286.3937278959421, 0.47270184138376486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1549.6363636363637, 545, 3469, 1459.0, 2910.5999999999995, 3423.8499999999995, 3469.0, 0.08898164551330276, 0.027996355797154208, 0.04014601584682214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 280.8, 131, 383, 377.0, 383.0, 383.0, 383.0, 0.03748125937031484, 0.010102370689655173, 0.02207148378935532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 179.2, 126, 380, 131.0, 380.0, 380.0, 380.0, 0.03755163349605708, 0.010121338715734134, 0.02207625328576793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 291.45454545454544, 128, 1399, 131.0, 1195.6000000000008, 1399.0, 1399.0, 0.07329180131258954, 6.0132396329579905, 0.042514970683279474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 232.54545454545456, 126, 1013, 130.0, 886.4000000000004, 1013.0, 1013.0, 0.07347980307412777, 1.9821411722366584, 0.042695784012798846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 128.6363636363636, 126, 131, 129.0, 130.8, 131.0, 131.0, 0.07391777655328127, 0.054933035114303766, 0.03710325893397127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 129.0, 127, 132, 129.0, 132.0, 132.0, 132.0, 0.03755191552321084, 0.01004807114585915, 0.021416326821831182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 152.45454545454547, 125, 390, 129.0, 338.4000000000002, 390.0, 390.0, 0.07391727984410174, 0.029871400732453045, 0.041591594429325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 130.2, 128, 133, 129.0, 133.0, 133.0, 133.0, 0.03755135147313952, 0.027906814913143722, 0.018849018219915734], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 678.2307692307692, 128, 1900, 557.0, 1487.1999999999996, 1900.0, 1900.0, 0.0675921593095201, 0.01266337479852337, 0.04600247621275932], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 192.2, 138, 385, 147.0, 385.0, 385.0, 385.0, 0.03985175148447774, 0.0313676872036026, 0.014166052285497947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1828.45, 979, 3319, 1787.5, 2228.4, 3264.899999999999, 3319.0, 0.08580376678536188, 0.04441015273070488, 0.03946638101162641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 413.0, 261, 514, 510.0, 514.0, 514.0, 514.0, 0.037443927718241926, 0.05803077469614253, 0.08421227103038201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb8171a2-f75c-421b-a467-79dd5b8ab177", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.5692262700534759, 1.0636001559714794], "isController": false}, {"data": ["addBook", 56, 11, 19.642857142857142, 1389.6607142857142, 663, 5636, 1098.5, 2266.1, 2431.8999999999996, 5636.0, 0.2639542227962179, 85.59388632233996, 0.9585647842645576], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 227.32075471698104, 127, 660, 133.0, 516.0, 534.0, 660.0, 0.24034755162937502, 0.17861766288081482, 0.11618363091459045], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 837.11320754717, 627, 1181, 775.0, 1107.2000000000003, 1160.6999999999998, 1181.0, 0.24023425105839052, 70.636846339034, 0.1208209368115929], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 227.01886792452828, 127, 515, 134.0, 397.2, 436.6999999999997, 515.0, 0.24080620098685107, 0.4261140978400138, 0.11711082821430843], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1246.1886792452829, 874, 1692, 1255.0, 1522.8, 1579.8999999999996, 1692.0, 0.23998949479947293, 215.9429692770996, 0.12046347688176669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 135.0625, 129, 144, 134.5, 142.6, 144.0, 144.0, 0.0797027088958186, 0.05954352764189572, 0.028331822302810516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 11, 6.666666666666667, 225.47878787878787, 128, 3408, 140.0, 378.20000000000005, 501.7999999999997, 2150.7000000000066, 0.692204103721541, 1.4807292933959533, 0.3325168908289249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 137.6, 134, 144, 137.0, 144.0, 144.0, 144.0, 0.024430285736621978, 0.018919156825333232, 0.008684203132939843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/571a7a1f-4336-4664-9b04-349a7ce101da", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.48165299773755654, 0.899969362745098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 210.99999999999997, 131, 495, 136.5, 403.20000000000016, 495.0, 495.0, 0.1396225536965071, 0.11330697472831777, 0.04963145463430526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82e28206-e2fb-40d0-9237-183ceb8afc38", 3, 0, 0.0, 471.33333333333337, 231, 868, 315.0, 868.0, 868.0, 868.0, 0.060700483580519195, 0.027465388078425024, 0.03892576583776784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 517.4, 264, 1525, 265.0, 1525.0, 1525.0, 1525.0, 0.023631834917454003, 5.683677846100038, 0.05193926529806833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80275334-21da-41d3-ac87-014636d7f0c3", 3, 0, 0.0, 356.3333333333333, 245, 484, 340.0, 484.0, 484.0, 484.0, 0.018500931213537748, 0.02550502724262121, 0.011864203935764766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 444.9090909090909, 256, 1528, 262.0, 1326.2000000000007, 1528.0, 1528.0, 0.07322934765965662, 8.06751548218197, 0.1629912087335983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1820ae35-f834-4c75-9611-b0ae838ed638", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87e96dd1-9e7b-4a3e-a59e-446dc00a1eb5", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.5409103667664671, 2.0642309131736525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b3a9b07-5ac2-4b52-a29a-06ddbde1e025", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e83db85b-998d-4b5b-a7ac-344a9157f099", 3, 0, 0.0, 441.6666666666667, 274, 633, 418.0, 633.0, 633.0, 633.0, 0.03760718046432332, 0.03135155897432683, 0.024116583826405254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb3e1e29-1c01-46cb-bad6-635307788b6e", 1, 0, 0.0, 928.0, 928, 928, 928.0, 928.0, 928.0, 928.0, 1.0775862068965516, 0.19468110183189655, 0.7429451778017241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 140.23076923076923, 131, 168, 137.0, 163.6, 168.0, 168.0, 0.07248558651991123, 0.06009791304238734, 0.025766360833249697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 170.99999999999997, 132, 387, 134.5, 384.3, 387.0, 387.0, 0.08785587731414822, 0.0682084203757303, 0.03123001888901362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebbe106c-8ed7-4f84-bdb2-abaa5ea24d9d", 1, 0, 0.0, 1268.0, 1268, 1268, 1268.0, 1268.0, 1268.0, 1268.0, 0.7886435331230284, 0.14247954455835962, 0.5437327484227129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=768d678f-a373-4f3a-84e7-055bb6a310e0", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 163.87499999999997, 128, 391, 132.0, 384.7, 391.0, 391.0, 0.07990970203669853, 0.059386018798757406, 0.04011092465513969], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f1c07e2-1bf5-48b5-8820-5d5e34bd27eb", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 193.31250000000003, 127, 384, 131.0, 384.0, 384.0, 384.0, 0.07990930294116178, 0.04388573656399986, 0.04431493692159399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 425.56250000000006, 127, 1474, 132.5, 1401.9, 1474.0, 1474.0, 0.07990850476204746, 13.499089441027522, 0.045689872595877715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 352.12499999999994, 126, 1055, 134.0, 1020.0, 1055.0, 1055.0, 0.079907307523273, 4.422887029171162, 0.04576722252187462], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.4850444624090542], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.08084074373484236], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.08084074373484236], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.0509296685529508], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1237, 21, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

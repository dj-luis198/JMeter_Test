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

    var data = {"OkPercent": 96.24724061810154, "KoPercent": 3.752759381898455};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7258576874205845, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08b0c634-e924-4faf-9124-46bc6b560256"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=704a2eaa-5515-4b95-a989-c803a113270a"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba1b6162-e2c1-41be-8951-93ba981ec9a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ab03b77-0882-4b07-80ab-bf70ec1ef59f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08b0c634-e924-4faf-9124-46bc6b560256"], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ab03b77-0882-4b07-80ab-bf70ec1ef59f"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba1b6162-e2c1-41be-8951-93ba981ec9a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8ff5aae-8252-4737-a3ae-0ce6d8307219"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34f470d9-f90c-48d4-bbdb-957198c63d2b"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8ff5aae-8252-4737-a3ae-0ce6d8307219"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e57a6e7f-8820-42cf-a0d7-60d0162337d1"], "isController": false}, {"data": [0.16923076923076924, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8381b623-be79-4806-ba95-5ea568d6fa06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8381b623-be79-4806-ba95-5ea568d6fa06"], "isController": false}, {"data": [0.39090909090909093, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8351351351351352, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b59c2d4-873d-4c05-a8bf-5c40bbd1a6c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e043c63c-cef5-4707-94a5-e04f4188b8e9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77cd9ef7-add1-48b3-b984-518a8575d835"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e043c63c-cef5-4707-94a5-e04f4188b8e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/835b7fcd-148d-4f3d-9e23-7a8f4c4181a4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/34f470d9-f90c-48d4-bbdb-957198c63d2b"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/704a2eaa-5515-4b95-a989-c803a113270a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/77cd9ef7-add1-48b3-b984-518a8575d835"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1359, 51, 3.752759381898455, 460.0470934510675, 136, 2658, 156.0, 1326.0, 1567.0, 2021.4, 5.350541156646049, 728.8261765887742, 3.9326794316181943], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2388.981818181819, 1700, 3271, 2363.0, 2816.0, 3013.199999999999, 3271.0, 0.24599585832427623, 296.01639059222384, 1.209559713537823], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 467.55, 291, 1640, 301.0, 750.5, 1595.5999999999995, 1640.0, 0.0993912287240651, 6.0916583193564415, 0.22226169399925458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 189.41176470588235, 144, 485, 153.0, 442.59999999999997, 485.0, 485.0, 0.10415135029162378, 0.08085969090023526, 0.037022550298975644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08b0c634-e924-4faf-9124-46bc6b560256", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 0.23191792362002567, 0.8850489409499358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=704a2eaa-5515-4b95-a989-c803a113270a", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 480.07142857142856, 283, 859, 574.5, 729.5, 859.0, 859.0, 0.10780508840017249, 0.1670768313389392, 0.2424561704937473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba1b6162-e2c1-41be-8951-93ba981ec9a7", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 147.14285714285717, 138, 158, 147.0, 155.5, 158.0, 158.0, 0.07143403831925912, 0.05308721011812128, 0.03585653876572186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 145.35714285714283, 137, 150, 147.0, 150.0, 150.0, 150.0, 0.07143513179781817, 0.019114478625588065, 0.04074034860344317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ab03b77-0882-4b07-80ab-bf70ec1ef59f", 3, 0, 0.0, 380.0, 240, 525, 375.0, 525.0, 525.0, 525.0, 0.07181844297615628, 0.03249597517475821, 0.04605544683041272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 146.42857142857144, 142, 152, 146.0, 151.0, 152.0, 152.0, 0.07143731885537005, 0.019254589847736456, 0.04199733003020778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 185.50000000000003, 139, 441, 143.5, 436.0, 441.0, 441.0, 0.07133249093058329, 0.019226335446133776, 0.04200536331166184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 150.66666666666666, 148, 153, 151.0, 153.0, 153.0, 153.0, 0.11017664989533218, 0.032493504168349924, 0.06810724549193875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08b0c634-e924-4faf-9124-46bc6b560256", 3, 0, 0.0, 344.3333333333333, 249, 489, 295.0, 489.0, 489.0, 489.0, 0.039397481187702726, 0.032844059023993066, 0.025264660787686972], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1617.581818181818, 1117, 2658, 1533.0, 2174.7999999999997, 2395.199999999999, 2658.0, 0.23571058169085915, 281.99180195918353, 0.4654363243934738], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 485.53846153846155, 150, 1470, 459.0, 1110.3999999999996, 1470.0, 1470.0, 0.06454015142112449, 0.013361828223904679, 0.043154438686856145], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 485.53846153846155, 150, 1470, 459.0, 1110.3999999999996, 1470.0, 1470.0, 0.06374517620637746, 0.013197243511476582, 0.04262288261816149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ab03b77-0882-4b07-80ab-bf70ec1ef59f", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 10, 45.45454545454545, 906.9090909090911, 226, 1999, 883.0, 1705.8999999999999, 1962.5499999999995, 1999.0, 0.10634286874389737, 0.03277898084861609, 0.04797891148406307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 180.5, 143, 423, 146.5, 423.0, 423.0, 423.0, 0.035892144106958596, 0.009674054466328684, 0.021135705953609404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 241.5, 137, 446, 149.0, 440.6, 446.0, 446.0, 0.1070721130681514, 0.04651874356823765, 0.06006541065129587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 183.125, 138, 449, 148.0, 449.0, 449.0, 449.0, 0.035891338971264494, 0.009673837457098633, 0.02110018169990354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 197.33333333333331, 138, 445, 150.0, 445.0, 445.0, 445.0, 0.10706064985814465, 0.07956362748246883, 0.05373942776082651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 323.55555555555554, 146, 1102, 150.5, 842.8000000000004, 1102.0, 1102.0, 0.1070651074814718, 3.5235061815229414, 0.062024805647089606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 362.00000000000006, 139, 1686, 149.5, 1619.4, 1686.0, 1686.0, 0.10706383383692988, 10.729675808480646, 0.0619195132759154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 264.2941176470588, 139, 1325, 145.0, 618.5999999999993, 1325.0, 1325.0, 0.10282589760960031, 5.4686094177181115, 0.05993058117802187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 251.47058823529406, 139, 819, 145.0, 517.3999999999997, 819.0, 819.0, 0.10282589760960031, 1.8045685130467919, 0.060030997093656245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 214.62499999999997, 142, 429, 144.0, 429.0, 429.0, 429.0, 0.03584646957082815, 0.009591731115631748, 0.020443689677112926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba1b6162-e2c1-41be-8951-93ba981ec9a7", 3, 0, 0.0, 405.0, 334, 442, 439.0, 442.0, 442.0, 442.0, 0.030041156384246415, 0.030129167584590888, 0.019264673853178853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 180.88235294117646, 140, 447, 147.0, 431.0, 447.0, 447.0, 0.1028283854733735, 0.07641836068870823, 0.051615029427064425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 184.75, 143, 446, 148.0, 446.0, 446.0, 446.0, 0.035890372856111005, 0.026672435296387183, 0.018015284812540094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 195.17647058823533, 140, 443, 146.0, 435.0, 443.0, 443.0, 0.10282216603965307, 0.036597319668065856, 0.0581327986076669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 191.125, 144, 453, 152.5, 453.0, 453.0, 453.0, 0.035620781163730915, 0.028037450798796017, 0.012662074554294977], "isController": false}, {"data": ["deleteAccount", 12, 3, 25.0, 463.3333333333333, 145, 1222, 454.5, 1036.6000000000006, 1222.0, 1222.0, 0.07959829394323314, 0.01611010392552253, 0.05416026494623798], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8ff5aae-8252-4737-a3ae-0ce6d8307219", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34f470d9-f90c-48d4-bbdb-957198c63d2b", 1, 0, 0.0, 829.0, 829, 829, 829.0, 829.0, 829.0, 829.0, 1.2062726176115801, 0.21793011158021713, 0.8316684258142341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1415.6363636363637, 959, 2613, 1364.5, 1872.2, 2504.8499999999985, 2613.0, 0.10734849224163169, 0.05556123133600078, 0.049376113130672396], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 310.0, 145, 1071, 254.5, 756.5, 1071.0, 1071.0, 0.06663144718743902, 0.10433473259372428, 0.0430622459676076], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 441.5, 293, 896, 300.0, 896.0, 896.0, 896.0, 0.035821430170599564, 0.055516220391349125, 0.08056323601844803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8ff5aae-8252-4737-a3ae-0ce6d8307219", 3, 0, 0.0, 325.0, 220, 419, 336.0, 419.0, 419.0, 419.0, 0.04432427640618767, 0.028496238900462448, 0.02842409652349925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 147.75000000000003, 141, 158, 148.5, 156.4, 157.95, 158.0, 0.09946537361680964, 0.07391909113514858, 0.04992695511625016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 1055.1, 733, 1330, 1179.5, 1320.9, 1330.0, 1330.0, 0.05325664376630985, 15.659221554295147, 0.030372929647973584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 175.35, 139, 440, 147.0, 407.9000000000006, 439.8, 440.0, 0.09946784701845128, 0.03408522218630328, 0.05631006925448849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1449.4, 999, 1909, 1391.0, 1888.3000000000002, 1909.0, 1909.0, 0.053048709324902125, 47.733321900231296, 0.030202536656658143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e57a6e7f-8820-42cf-a0d7-60d0162337d1", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["addBook", 65, 29, 44.61538461538461, 1264.1230769230765, 734, 2756, 1053.0, 2420.4, 2520.7, 2756.0, 0.2864332015740606, 64.4184526396472, 1.0435317530483104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 316.3, 145, 449, 415.0, 448.2, 449.0, 449.0, 0.05338857270989717, 0.09447274780306023, 0.02956183664698408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 190.00000000000003, 139, 429, 149.0, 427.8, 429.0, 429.0, 0.05763433232842703, 0.04283176455266891, 0.02892973321954247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8381b623-be79-4806-ba95-5ea568d6fa06", 3, 0, 0.0, 615.0, 304, 1071, 470.0, 1071.0, 1071.0, 1071.0, 0.02183104228672891, 0.030095854194107072, 0.013999724383091128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 300.7692307692308, 137, 447, 427.0, 445.0, 447.0, 447.0, 0.05763586546902294, 0.015422096814953403, 0.03287045452530214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 214.30769230769232, 141, 451, 149.0, 449.0, 451.0, 451.0, 0.05755650499191995, 0.015513276736103424, 0.03383692969251544], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 243.50909090909087, 139, 600, 150.0, 580.0, 597.4, 600.0, 0.23704240042064254, 0.17616139328135638, 0.11458592598458793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 277.61538461538464, 138, 448, 150.0, 444.8, 448.0, 448.0, 0.05763407681292422, 0.015534184765983481, 0.03393881671698565], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 952.9272727272727, 679, 1518, 878.0, 1289.8, 1358.9999999999993, 1518.0, 0.2366018807698595, 69.56880886816113, 0.11899410995749769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 175.5, 145, 411, 148.0, 386.5000000000001, 411.0, 411.0, 0.05346507126894, 0.03973331956607748, 0.030021890605117674], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 216.8181818181818, 136, 464, 151.0, 443.2, 454.79999999999995, 464.0, 0.2375060995884667, 0.420274465287404, 0.11550589608892228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 890.3125, 142, 2057, 853.0, 1854.0000000000002, 2057.0, 2057.0, 0.0899821722821166, 40.49518489930433, 0.049033254036544016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 317.05, 142, 1493, 149.0, 600.5, 1448.3999999999994, 1493.0, 0.09946636296270508, 4.500469240338086, 0.05804794776026617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8381b623-be79-4806-ba95-5ea568d6fa06", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1362.1272727272724, 954, 2021, 1328.0, 1716.0, 1781.3999999999996, 2021.0, 0.23631723225257587, 212.6386609822526, 0.11862017322053124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 669.6875000000001, 141, 1404, 521.0, 1334.7, 1404.0, 1404.0, 0.08998267833442063, 13.241074140103029, 0.049121403504825314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 195.05, 139, 848, 146.0, 397.8000000000006, 826.8499999999997, 848.0, 0.09946982582833498, 1.4878412902977132, 0.058147107168790346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 151.5, 143, 161, 152.0, 158.0, 161.0, 161.0, 0.10350665769608967, 0.07732675111084823, 0.03679338222790687], "isController": false}, {"data": ["deleteBooks", 12, 3, 25.0, 472.33333333333337, 148, 829, 477.5, 815.2, 829.0, 829.0, 0.07947335655721419, 0.016628092424202285, 0.05337675876193756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 29, 15.675675675675675, 195.99459459459453, 139, 1035, 153.0, 329.60000000000025, 424.09999999999997, 669.4999999999942, 0.7598596929345371, 1.5796409650115415, 0.3662520511077522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 154.49999999999997, 146, 188, 151.5, 174.0, 188.0, 188.0, 0.07120043940842606, 0.055138621534064326, 0.025309531195963953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 542.8461538461538, 288, 870, 587.0, 868.4, 870.0, 870.0, 0.05751906978390528, 0.08914332397173601, 0.12936173604720103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 183.16666666666666, 143, 448, 150.0, 439.0, 448.0, 448.0, 0.1095476897609426, 0.08890051776498369, 0.03894078034471006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 544.2272727272727, 178, 1459, 408.5, 1262.2999999999997, 1444.2999999999997, 1459.0, 0.10309664842168403, 0.06332792173558521, 0.04661498849535128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 146.9375, 139, 158, 146.0, 153.1, 158.0, 158.0, 0.08997863007535711, 0.06686888426498706, 0.04516505454954448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 235.9375, 141, 449, 149.0, 446.2, 449.0, 449.0, 0.08998369045610483, 0.09165330971261458, 0.047540211461672574], "isController": false}, {"data": ["login", 22, 0, 0.0, 2921.4545454545455, 1593, 4660, 3078.5, 3951.6, 4563.0999999999985, 4660.0, 0.10576109530036151, 57.65041623901527, 0.23928635597742481], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 337.50000000000006, 288, 588, 300.0, 584.5, 588.0, 588.0, 0.0712772890192245, 0.11046587663428642, 0.1603042935656973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b59c2d4-873d-4c05-a8bf-5c40bbd1a6c8", 2, 0, 0.0, 254.5, 240, 269, 254.5, 269.0, 269.0, 269.0, 0.03363945234971574, 0.03797578800417129, 0.0209096791216739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 168.04999999999998, 138, 426, 152.5, 175.90000000000003, 413.54999999999984, 426.0, 0.10249682259849945, 0.08297838470132426, 0.03643441740806035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 483.88235294117646, 283, 1482, 299.0, 997.9999999999995, 1482.0, 1482.0, 0.10273455204713704, 7.379631553104699, 0.22950620373168154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e043c63c-cef5-4707-94a5-e04f4188b8e9", 3, 0, 0.0, 762.3333333333334, 296, 1563, 428.0, 1563.0, 1563.0, 1563.0, 0.059201957611398355, 0.026787344101511623, 0.037964797035955324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77cd9ef7-add1-48b3-b984-518a8575d835", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 151.07692307692307, 147, 156, 151.0, 154.8, 156.0, 156.0, 0.06031670912035039, 0.050008677776540514, 0.021440705195124553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e043c63c-cef5-4707-94a5-e04f4188b8e9", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 0.6843335700757576, 2.611564867424242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/835b7fcd-148d-4f3d-9e23-7a8f4c4181a4", 2, 0, 0.0, 324.5, 238, 411, 324.5, 411.0, 411.0, 411.0, 0.01683941095740471, 0.02848228493967281, 0.010467075267957126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34f470d9-f90c-48d4-bbdb-957198c63d2b", 3, 0, 0.0, 606.3333333333333, 269, 1222, 328.0, 1222.0, 1222.0, 1222.0, 0.029540933887389962, 0.029627479592138174, 0.018943893150442127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1044.0, 288, 2204, 999.0, 2009.4, 2204.0, 2204.0, 0.08990531846149524, 53.848676354901244, 0.19069760908043715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 151.24999999999997, 145, 159, 151.0, 156.9, 159.0, 159.0, 0.09190859690038257, 0.07135481888262123, 0.032670634054432865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/704a2eaa-5515-4b95-a989-c803a113270a", 3, 0, 0.0, 401.0, 259, 604, 340.0, 604.0, 604.0, 604.0, 0.03605379225804901, 0.023179114488817314, 0.02312043318631398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77cd9ef7-add1-48b3-b984-518a8575d835", 3, 0, 0.0, 328.3333333333333, 222, 525, 238.0, 525.0, 525.0, 525.0, 0.06473609252945492, 0.030007876224591085, 0.041513705170255925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 6, 37.5, 1070.6249999999998, 145, 2055, 1455.0, 1910.1000000000001, 2055.0, 2055.0, 0.0848122468884507, 63.424093204683764, 0.14059969712751522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 663.6111111111113, 290, 1830, 579.0, 1758.9, 1830.0, 1830.0, 0.10696394720734961, 14.365805928773895, 0.23752356549461912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 166.78571428571428, 139, 430, 147.5, 292.0, 430.0, 430.0, 0.1079305852150517, 0.08021013217642026, 0.054176094531773994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 243.2857142857143, 139, 446, 145.5, 436.0, 446.0, 446.0, 0.10794223548369686, 0.028882980979036074, 0.061560806174295865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 248.28571428571425, 137, 446, 149.5, 446.0, 446.0, 446.0, 0.10793308148947653, 0.029091338370210468, 0.06345284673502428], "isController": false}, {"data": ["register", 22, 10, 45.45454545454545, 906.9090909090911, 226, 1999, 883.0, 1705.8999999999999, 1962.5499999999995, 1999.0, 0.10557635089739897, 0.03254271043286304, 0.04763308019003743], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 207.21428571428575, 138, 451, 147.0, 441.0, 451.0, 451.0, 0.10794306774198523, 0.029094029977331955, 0.06356413071134481], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 19.607843137254903, 0.7358351729212657], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 5.882352941176471, 0.22075055187637968], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 5.882352941176471, 0.22075055187637968], "isController": false}, {"data": ["401/Unauthorized", 35, 68.62745098039215, 2.57542310522443], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1359, 51, "401/Unauthorized", 35, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 29, "401/Unauthorized", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

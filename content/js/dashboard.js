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

    var data = {"OkPercent": 98.43871975019516, "KoPercent": 1.56128024980484};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7697986577181208, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05555555555555555, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97482c04-814d-4ea8-97d5-cb04dcceeb0a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47b7b0c0-521c-40ae-bca1-a9811ebf96fd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/56fadec1-3424-47a1-9018-6c8c33bc8d2a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2b13ea99-6631-4bac-afdd-b349ed0f901a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/526c1a27-001e-40b6-ac66-06ad12c09cb0"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=feb6275f-c808-4125-91ac-840139000cde"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d419879-fb02-4310-bc9e-912774af9039"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d419879-fb02-4310-bc9e-912774af9039"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17e34a33-3aa3-449d-9eb6-c0e28e099df1"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cded743c-ef1a-4ab7-824c-0af076ebf41c"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7019f403-6009-43ad-ad55-7db0a68cdccd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=122efcd8-bb21-40c4-8cf2-2eab90d88770"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47b7b0c0-521c-40ae-bca1-a9811ebf96fd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7b7f7f1-3216-48be-a6ff-07be9dbac37b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a03f2883-a9a5-46bf-990b-4c63893a42cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c6dfd94-14f1-4844-8048-4cc38c38e55f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b70828aa-9865-44bd-9943-609c40b561d2"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56fadec1-3424-47a1-9018-6c8c33bc8d2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3425925925925926, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b13ea99-6631-4bac-afdd-b349ed0f901a"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/feb6275f-c808-4125-91ac-840139000cde"], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "addBook"], "isController": true}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17e34a33-3aa3-449d-9eb6-c0e28e099df1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9058823529411765, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a03f2883-a9a5-46bf-990b-4c63893a42cd"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7b7f7f1-3216-48be-a6ff-07be9dbac37b"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7019f403-6009-43ad-ad55-7db0a68cdccd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cded743c-ef1a-4ab7-824c-0af076ebf41c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c6dfd94-14f1-4844-8048-4cc38c38e55f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b70828aa-9865-44bd-9943-609c40b561d2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/122efcd8-bb21-40c4-8cf2-2eab90d88770"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1281, 20, 1.56128024980484, 409.38095238095184, 108, 3674, 128.0, 1134.8, 1363.7999999999997, 1859.0400000000018, 5.0419175817688044, 718.9817274766797, 3.687521832073838], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1920.0555555555554, 1366, 2812, 1944.0, 2276.5, 2552.0, 2812.0, 0.2557581096633939, 307.76242513746996, 1.2575606271046762], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/97482c04-814d-4ea8-97d5-cb04dcceeb0a", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.040182206840391, 1.9435820439739413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47b7b0c0-521c-40ae-bca1-a9811ebf96fd", 3, 0, 0.0, 424.0, 206, 769, 297.0, 769.0, 769.0, 769.0, 0.025175177275206646, 0.0252489326773801, 0.016144238031301137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56fadec1-3424-47a1-9018-6c8c33bc8d2a", 3, 0, 0.0, 682.3333333333334, 201, 1149, 697.0, 1149.0, 1149.0, 1149.0, 0.023107140106292844, 0.027311857332665793, 0.014818055341600554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b13ea99-6631-4bac-afdd-b349ed0f901a", 3, 0, 0.0, 1004.3333333333333, 321, 2254, 438.0, 2254.0, 2254.0, 2254.0, 0.048941237887043625, 0.030444891146530064, 0.03138484330647003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/526c1a27-001e-40b6-ac66-06ad12c09cb0", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 658.1538461538461, 472, 1289, 510.0, 1140.6, 1289.0, 1289.0, 0.07202455483284763, 0.01301224867585626, 0.04895418961295112], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 658.1538461538461, 472, 1289, 510.0, 1140.6, 1289.0, 1289.0, 0.0698474102729422, 0.012618916895013968, 0.047474411669890394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 144.9333333333333, 113, 342, 115.0, 340.2, 342.0, 342.0, 0.0897827258035554, 0.024023893427904473, 0.05120421080984019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 116.66666666666667, 114, 128, 115.0, 124.4, 128.0, 128.0, 0.08977574020097796, 0.06671810380170334, 0.045063213343069015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 159.8, 110, 342, 115.0, 341.4, 342.0, 342.0, 0.0897827258035554, 0.024199250314239543, 0.05287010123002334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 129.93333333333334, 113, 344, 115.0, 208.4000000000001, 344.0, 344.0, 0.08978380060813561, 0.02419954000766155, 0.05278305465439222], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 267.38461538461536, 200, 482, 233.0, 438.4, 482.0, 482.0, 0.07152052639107423, 0.14659236497749856, 0.04623690280360464], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 125.90476190476191, 109, 342, 115.0, 122.60000000000001, 320.1999999999997, 342.0, 0.10919868961572461, 0.08115254179449846, 0.054812623498518016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 157.76190476190476, 108, 346, 115.0, 341.6, 345.6, 346.0, 0.10920039312141523, 0.03702982080735491, 0.06184162887986397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 779.2857142857142, 673, 915, 696.0, 915.0, 915.0, 915.0, 0.09649316277018086, 28.372193728978278, 0.05503125689236877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1181.5714285714284, 1007, 1400, 1135.0, 1400.0, 1400.0, 1400.0, 0.0962133186722562, 86.57291326627036, 0.05477769998625524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 296.4285714285714, 117, 467, 344.0, 467.0, 467.0, 467.0, 0.09725734292939116, 0.1720999076055242, 0.05385245453219218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 152.33333333333334, 114, 433, 116.0, 433.0, 433.0, 433.0, 0.10876658690450294, 0.0808314185882097, 0.05459572819229933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 191.77777777777777, 113, 349, 117.0, 349.0, 349.0, 349.0, 0.10847032733934339, 0.029024286807597745, 0.061861983560719286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 190.8888888888889, 113, 342, 116.0, 342.0, 342.0, 342.0, 0.10847163466753444, 0.02923649528148389, 0.06376945709946849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 165.11111111111111, 114, 342, 115.0, 342.0, 342.0, 342.0, 0.1087679013837694, 0.029316348419844096, 0.06404984817813765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=feb6275f-c808-4125-91ac-840139000cde", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 150.14285714285714, 115, 347, 117.0, 347.0, 347.0, 347.0, 0.09725464043570078, 0.07227615368317217, 0.05461076001028121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 213.38095238095238, 109, 1286, 115.0, 343.0, 1191.6999999999987, 1286.0, 0.10920096096845652, 4.7070418125929505, 0.0637513422618119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 671.4499999999999, 111, 1456, 678.0, 1432.3000000000002, 1455.3, 1456.0, 0.09854741115950884, 44.349847698055655, 0.05370064006543548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 152.38095238095235, 112, 681, 115.0, 297.8000000000002, 647.1999999999996, 681.0, 0.10920096096845652, 1.5570176080049503, 0.06385798382525766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 512.0, 115, 943, 510.0, 911.8, 941.4499999999999, 943.0, 0.09854546887934093, 14.50110047572825, 0.05379581748393709], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 681.1538461538463, 208, 2065, 465.0, 1855.7999999999997, 2065.0, 2065.0, 0.07010807429298703, 0.012666009515822854, 0.04833623090903208], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8d419879-fb02-4310-bc9e-912774af9039", 3, 0, 0.0, 403.6666666666667, 288, 594, 329.0, 594.0, 594.0, 594.0, 0.06707507937217726, 0.030349726669051558, 0.04301364139426732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d419879-fb02-4310-bc9e-912774af9039", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 370.77777777777777, 230, 775, 239.0, 775.0, 775.0, 775.0, 0.10831889081455805, 0.1678731247292028, 0.24361172416594457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17e34a33-3aa3-449d-9eb6-c0e28e099df1", 3, 0, 0.0, 378.0, 211, 690, 233.0, 690.0, 690.0, 690.0, 0.0208939839255617, 0.024695981651599783, 0.013398811306431169], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 635.9545454545455, 163, 1587, 648.0, 1379.8999999999996, 1577.3999999999999, 1587.0, 0.09731585186757967, 0.05977702228975352, 0.0440012103659076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 117.45000000000002, 113, 135, 116.0, 126.10000000000002, 134.6, 135.0, 0.09854546887934093, 0.07323545099333832, 0.04946520605857543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 214.30000000000004, 113, 464, 117.0, 462.5, 463.95, 464.0, 0.09854644000985464, 0.100374938408475, 0.05206408598176891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cded743c-ef1a-4ab7-824c-0af076ebf41c", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["login", 22, 0, 0.0, 2987.5000000000005, 1486, 6053, 2739.0, 4429.4, 5817.649999999997, 6053.0, 0.10165466063515681, 38.832653433559436, 0.20700946427993844], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7019f403-6009-43ad-ad55-7db0a68cdccd", 3, 0, 0.0, 559.3333333333334, 213, 983, 482.0, 983.0, 983.0, 983.0, 0.03232793456826043, 0.026950468889750966, 0.02073112991519305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 142.09523809523807, 115, 348, 119.0, 301.8000000000002, 347.5, 348.0, 0.10356204105988352, 0.08384075394398774, 0.03681306928300547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=122efcd8-bb21-40c4-8cf2-2eab90d88770", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 790.95, 231, 1573, 794.5, 1548.2000000000003, 1572.25, 1573.0, 0.09848772104337891, 58.9890954856922, 0.2089016895568545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47b7b0c0-521c-40ae-bca1-a9811ebf96fd", 1, 0, 0.0, 2065.0, 2065, 2065, 2065.0, 2065.0, 2065.0, 2065.0, 0.48426150121065376, 0.08748865012106538, 0.33387560532687655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7b7f7f1-3216-48be-a6ff-07be9dbac37b", 3, 0, 0.0, 333.3333333333333, 240, 504, 256.0, 504.0, 504.0, 504.0, 0.02889477486154587, 0.028979427522273053, 0.018529526848061643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a03f2883-a9a5-46bf-990b-4c63893a42cd", 3, 0, 0.0, 363.3333333333333, 258, 459, 373.0, 459.0, 459.0, 459.0, 0.024494794856093082, 0.02456655695039804, 0.015707925086752398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c6dfd94-14f1-4844-8048-4cc38c38e55f", 3, 0, 0.0, 353.3333333333333, 208, 498, 354.0, 498.0, 498.0, 498.0, 0.03554881444703819, 0.029635583918901302, 0.022796603014539462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 323.2666666666666, 230, 460, 238.0, 458.8, 460.0, 460.0, 0.0897134552240145, 0.139038333437999, 0.2017676634579154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 0, 0.0, 1332.142857142857, 1122, 1521, 1344.0, 1521.0, 1521.0, 1521.0, 0.09575661404612733, 114.55820078452025, 0.2159199431958086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b70828aa-9865-44bd-9943-609c40b561d2", 3, 0, 0.0, 542.0, 200, 1220, 206.0, 1220.0, 1220.0, 1220.0, 0.032869508053029475, 0.03296580543990359, 0.021078428015777365], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1137.782608695652, 271, 2162, 1093.0, 1868.2000000000003, 2121.3999999999996, 2162.0, 0.09032465823898334, 0.028180434304519768, 0.04075194541641631], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 362.90476190476187, 226, 1403, 233.0, 639.8000000000002, 1331.099999999999, 1403.0, 0.10913399575936474, 6.378329886084896, 0.24411524972196816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 133.82352941176472, 116, 346, 119.0, 181.19999999999985, 346.0, 346.0, 0.10165822504739067, 0.07892411026628475, 0.036136322184814655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 465.8888888888889, 230, 1353, 243.5, 1260.3000000000002, 1353.0, 1353.0, 0.09837140671111597, 19.7414473661739, 0.21704472483331513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 140.0, 114, 327, 116.0, 327.0, 327.0, 327.0, 0.050700512075171955, 0.0376787985246151, 0.0254492804752328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 166.44444444444446, 114, 341, 116.0, 341.0, 341.0, 341.0, 0.05063917897011163, 0.013549936560361901, 0.028880156756391787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56fadec1-3424-47a1-9018-6c8c33bc8d2a", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 140.0, 109, 337, 116.0, 337.0, 337.0, 337.0, 0.05070393969611439, 0.01366629624621833, 0.029808370797911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 167.00000000000003, 113, 342, 117.0, 342.0, 342.0, 342.0, 0.05063917897011163, 0.0136488412067879, 0.029819750897438782], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1348.814814814815, 901, 2333, 1242.0, 1808.5, 2076.0, 2333.0, 0.2438363587103766, 291.7130562516933, 0.4814815598753725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1137.782608695652, 271, 2162, 1093.0, 1868.2000000000003, 2121.3999999999996, 2162.0, 0.09228571657852712, 0.02879226585508735, 0.041636719784452665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 190.33333333333331, 115, 340, 116.0, 340.0, 340.0, 340.0, 0.01885452477170313, 0.005081883629873109, 0.011102810973961902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 113.33333333333333, 111, 115, 114.0, 115.0, 115.0, 115.0, 0.018881699856499082, 0.005089208164447018, 0.011100374329699656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b13ea99-6631-4bac-afdd-b349ed0f901a", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 209.2941176470588, 113, 1238, 115.0, 523.5999999999993, 1238.0, 1238.0, 0.09887687502544626, 5.258587792850038, 0.05762895071278594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 187.6470588235294, 110, 679, 115.0, 411.7999999999997, 679.0, 679.0, 0.09887572484630641, 1.7352439794861954, 0.05772483867262248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 129.58823529411765, 111, 347, 116.0, 168.59999999999985, 347.0, 347.0, 0.09887572484630641, 0.07348088535941326, 0.049630979073243646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 190.0, 113, 341, 116.0, 341.0, 341.0, 341.0, 0.01885440627474641, 0.005045026678984879, 0.01075290357856631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 141.94117647058823, 110, 351, 115.0, 347.0, 351.0, 351.0, 0.09887687502544626, 0.03519307890956255, 0.055902240579069506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 191.0, 116, 334, 123.0, 334.0, 334.0, 334.0, 0.018881105677548478, 0.014031759199818741, 0.0094774299983007], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 673.8461538461538, 438, 1220, 504.0, 1191.6, 1220.0, 1220.0, 0.07223105046172311, 0.013049555015057395, 0.049165080245918945], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 197.33333333333334, 118, 353, 121.0, 353.0, 353.0, 353.0, 0.018118458481552392, 0.01426120853137815, 0.006440545788364326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1591.5909090909088, 969, 3674, 1501.0, 2291.5999999999995, 3487.699999999997, 3674.0, 0.09955201592832254, 0.051525945744151314, 0.04579003857640617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 383.0, 233, 676, 240.0, 676.0, 676.0, 676.0, 0.018840552404996515, 0.029199176432352997, 0.04237284393428416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/feb6275f-c808-4125-91ac-840139000cde", 3, 0, 0.0, 326.0, 232, 501, 245.0, 501.0, 501.0, 501.0, 0.07124706105873133, 0.03154166765620918, 0.04568903329612654], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1159.172413793103, 585, 3348, 928.5, 2065.7, 2328.549999999999, 3348.0, 0.27349846982321624, 85.69889800452215, 0.9934397207014763], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 219.42592592592587, 114, 718, 117.5, 461.5, 465.25, 718.0, 0.24533299410746492, 0.1823226645661922, 0.11859358601874526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17e34a33-3aa3-449d-9eb6-c0e28e099df1", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 729.8148148148148, 562, 1131, 677.5, 931.0, 1028.75, 1131.0, 0.24541438673671578, 72.15997822515406, 0.12342618082950063], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 172.1851851851852, 111, 462, 118.0, 344.0, 358.0, 462.0, 0.246045053583145, 0.4353844112232995, 0.11965862957461544], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1127.0555555555554, 784, 1690, 1124.5, 1398.5, 1582.25, 1690.0, 0.24466716204215525, 220.15194248452707, 0.12281144657194121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 118.27777777777779, 116, 125, 118.0, 120.5, 125.0, 125.0, 0.0962973662670326, 0.071940903510039, 0.034230704415234244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, 7.0588235294117645, 193.96470588235306, 113, 1854, 121.0, 328.5, 409.6499999999996, 1491.899999999996, 0.689968667305226, 1.491486496907317, 0.3315876534165625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 118.88888888888889, 116, 125, 118.0, 125.0, 125.0, 125.0, 0.049903796569945716, 0.038646201835905225, 0.017739240186972892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 136.0, 115, 352, 118.0, 224.20000000000007, 352.0, 352.0, 0.09276667326340787, 0.0752823295721601, 0.03297565338660202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a03f2883-a9a5-46bf-990b-4c63893a42cd", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7b7f7f1-3216-48be-a6ff-07be9dbac37b", 1, 0, 0.0, 1542.0, 1542, 1542, 1542.0, 1542.0, 1542.0, 1542.0, 0.648508430609598, 0.11716216763942931, 0.44711616407263294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 332.77777777777777, 230, 669, 243.0, 669.0, 669.0, 669.0, 0.0506033038334814, 0.07842523748411617, 0.11380801633643324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 353.64705882352933, 228, 1362, 233.0, 824.3999999999995, 1362.0, 1362.0, 0.09880906020959146, 7.0976555007585045, 0.2207367614022749], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7019f403-6009-43ad-ad55-7db0a68cdccd", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cded743c-ef1a-4ab7-824c-0af076ebf41c", 3, 0, 0.0, 287.0, 198, 458, 205.0, 458.0, 458.0, 458.0, 0.047243350498417346, 0.030926555290467866, 0.03029602880269602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c6dfd94-14f1-4844-8048-4cc38c38e55f", 1, 0, 0.0, 891.0, 891, 891, 891.0, 891.0, 891.0, 891.0, 1.122334455667789, 0.2027655022446689, 0.7737969977553311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 124.11111111111111, 117, 135, 123.0, 135.0, 135.0, 135.0, 0.11150620098373248, 0.09244996546405165, 0.03963696988093616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 136.5, 115, 465, 118.5, 124.80000000000001, 447.9999999999998, 465.0, 0.09732786350740423, 0.0755621596566273, 0.03459701398114759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b70828aa-9865-44bd-9943-609c40b561d2", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/122efcd8-bb21-40c4-8cf2-2eab90d88770", 3, 0, 0.0, 670.6666666666666, 217, 1298, 497.0, 1298.0, 1298.0, 1298.0, 0.03599236961764106, 0.030005357614185792, 0.023081044318604457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 116.8888888888889, 113, 126, 116.0, 122.4, 126.0, 126.0, 0.09843703857638168, 0.07315486948889302, 0.04941077912916033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 166.33333333333334, 112, 348, 116.5, 344.4, 348.0, 348.0, 0.09843542362778285, 0.050980064775977385, 0.05476111294917998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 346.7222222222222, 114, 1239, 122.5, 1140.9, 1239.0, 1239.0, 0.09843380873217256, 14.783928177156247, 0.05645845409703386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 272.22222222222223, 113, 904, 117.0, 903.1, 904.0, 904.0, 0.09843542362778285, 4.845990004019447, 0.05655550869239477], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 40.0, 0.624512099921936], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.936768149882904], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1281, 20, "401/Unauthorized", 12, "406/Not Acceptable", 8, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

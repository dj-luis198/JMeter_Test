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

    var data = {"OkPercent": 99.47604790419162, "KoPercent": 0.5239520958083832};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8292604501607717, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3684210526315789, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbb70198-2491-4d5b-8380-2e69df066543"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ec0ab83-d13a-4ba4-aefa-fc1077f66f0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffc60513-0dfe-4aed-975a-4cbd1a62dca7"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47beb849-551e-4476-8f35-27d17ed33a5d"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6494b945-8266-4101-9882-4a40366a5d4c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=848500e8-a738-4419-b1ae-691c0df1e2bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86b7436c-6208-4d93-b8ec-091c786510b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/557f24e1-c61d-48ca-87c7-d7c040bb9d42"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1706689a-099d-447e-8465-012695bdad2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88aec457-2a7b-4a61-827e-6d22a1d69878"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5428ad09-eda8-4e34-b5b9-700f1cfbdb88"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/86b7436c-6208-4d93-b8ec-091c786510b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5428ad09-eda8-4e34-b5b9-700f1cfbdb88"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76537b57-a920-4cfd-96f9-25051efbd010"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d65195fe-cbae-4a7a-a120-1f9663bab0de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5fd2ed5-333f-4179-96de-7e6acbb933f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/785e58d0-ce8e-4639-9228-e2e784a087e2"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5171dcb4-ff14-4cdc-bee6-c79cde63ce9b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbb70198-2491-4d5b-8380-2e69df066543"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1036417e-ccea-450b-8db8-d7b24cc03b91"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/848500e8-a738-4419-b1ae-691c0df1e2bb"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31057565-204f-4ef3-831e-b639ef79b2a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76537b57-a920-4cfd-96f9-25051efbd010"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffc60513-0dfe-4aed-975a-4cbd1a62dca7"], "isController": false}, {"data": [0.4274193548387097, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7807017543859649, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88aec457-2a7b-4a61-827e-6d22a1d69878"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6494b945-8266-4101-9882-4a40366a5d4c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1706689a-099d-447e-8465-012695bdad2b"], "isController": false}, {"data": [0.9668508287292817, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=557f24e1-c61d-48ca-87c7-d7c040bb9d42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d65195fe-cbae-4a7a-a120-1f9663bab0de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1036417e-ccea-450b-8db8-d7b24cc03b91"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5171dcb4-ff14-4cdc-bee6-c79cde63ce9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4470093-472e-44fd-8494-7309f779156b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 7, 0.5239520958083832, 305.3547904191619, 80, 1884, 101.5, 840.0, 1030.3499999999988, 1425.9699999999978, 5.1815882964364945, 727.2000441596111, 3.774754410264664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1374.473684210526, 1047, 1801, 1346.0, 1694.8, 1755.1, 1801.0, 0.24875621890547261, 299.33616849278826, 1.223132384950249], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbb70198-2491-4d5b-8380-2e69df066543", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ec0ab83-d13a-4ba4-aefa-fc1077f66f0f", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffc60513-0dfe-4aed-975a-4cbd1a62dca7", 3, 0, 0.0, 271.3333333333333, 178, 381, 255.0, 381.0, 381.0, 381.0, 0.031766873504309706, 0.026482735366060273, 0.02037133489696944], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 592.1428571428571, 373, 919, 544.5, 868.5, 919.0, 919.0, 0.07552625616348198, 0.013644880263910317, 0.05133425223611665], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 592.1428571428571, 373, 919, 544.5, 868.5, 919.0, 919.0, 0.07512019230769232, 0.013571519118088942, 0.051058255709134616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 125.5, 82, 257, 83.5, 256.4, 257.0, 257.0, 0.12214859376431428, 0.03268429169084191, 0.0696628698812105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 87.0, 82, 97, 86.0, 96.4, 97.0, 97.0, 0.12214859376431428, 0.09077644517054997, 0.06131286835435307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 173.33333333333334, 82, 334, 165.5, 311.2000000000001, 334.0, 334.0, 0.12195121951219512, 0.03286966463414634, 0.07181307164634146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 125.5, 82, 255, 84.0, 255.0, 255.0, 255.0, 0.12194626234705906, 0.032868328523230766, 0.07169106438762653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47beb849-551e-4476-8f35-27d17ed33a5d", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 328.7333333333334, 163, 1884, 195.0, 1006.2000000000005, 1884.0, 1884.0, 0.07915066064418085, 0.17327604914200684, 0.05116966537739035], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6494b945-8266-4101-9882-4a40366a5d4c", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=848500e8-a738-4419-b1ae-691c0df1e2bb", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.24714646032831739, 0.9431643296853626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 96.64705882352942, 82, 249, 85.0, 128.1999999999999, 249.0, 249.0, 0.08661361158380632, 0.06436812345241856, 0.043475973002027775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 104.58823529411765, 80, 250, 85.0, 249.2, 250.0, 250.0, 0.08654086001252297, 0.030802341948391106, 0.04892780010588529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 578.6666666666666, 405, 682, 649.0, 682.0, 682.0, 682.0, 0.04733429053787532, 13.91785306450086, 0.02699533757238202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 831.3333333333334, 800, 892, 802.0, 892.0, 892.0, 892.0, 0.04703963873557451, 42.32634962113491, 0.026781356819179626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 199.0, 88, 255, 254.0, 255.0, 255.0, 255.0, 0.0475722305033142, 0.08418054850781771, 0.0263412643509562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86b7436c-6208-4d93-b8ec-091c786510b5", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 91.63636363636363, 84, 129, 87.0, 122.80000000000003, 129.0, 129.0, 0.09193634661674244, 0.06832378884310644, 0.04614773648535705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 113.90909090909092, 82, 246, 85.0, 245.8, 246.0, 246.0, 0.09193480986209779, 0.024599744045131634, 0.05243157124947764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 115.72727272727272, 82, 259, 86.0, 256.40000000000003, 259.0, 259.0, 0.09193404150404091, 0.02477909712413603, 0.05404716111858656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 114.0, 82, 247, 84.0, 246.8, 247.0, 247.0, 0.09193404150404091, 0.02477909712413603, 0.05413694045599285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 84.66666666666667, 82, 87, 85.0, 87.0, 87.0, 87.0, 0.0475722305033142, 0.0353539720830294, 0.026712922401763345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 538.2631578947369, 82, 1029, 778.0, 961.0, 1029.0, 1029.0, 0.09488376738495342, 44.947156530125596, 0.05148965954206097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 128.47058823529412, 81, 601, 83.0, 386.5999999999998, 601.0, 601.0, 0.08661493547187307, 4.606458711742947, 0.05048225731259331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 403.0526315789474, 80, 743, 592.0, 671.0, 743.0, 743.0, 0.09487713411132584, 14.694759349142862, 0.05157871337867462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 138.1764705882353, 81, 491, 85.0, 301.39999999999986, 491.0, 491.0, 0.08654041946650376, 1.5187624879097943, 0.05052333886937487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/557f24e1-c61d-48ca-87c7-d7c040bb9d42", 3, 0, 0.0, 586.0, 182, 937, 639.0, 937.0, 937.0, 937.0, 0.019912782014775286, 0.023536234210823258, 0.012769590029006284], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 544.3076923076924, 194, 1139, 409.0, 1115.0, 1139.0, 1139.0, 0.0863276866172164, 0.015596310570493196, 0.059518893312260526], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1706689a-099d-447e-8465-012695bdad2b", 3, 0, 0.0, 270.6666666666667, 163, 424, 225.0, 424.0, 424.0, 424.0, 0.03667930064800098, 0.030578023749847166, 0.023521556730651667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 237.90909090909093, 170, 344, 186.0, 343.8, 344.0, 344.0, 0.09186877797821875, 0.14237866274554017, 0.20661503484749782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88aec457-2a7b-4a61-827e-6d22a1d69878", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5428ad09-eda8-4e34-b5b9-700f1cfbdb88", 3, 0, 0.0, 348.6666666666667, 171, 473, 402.0, 473.0, 473.0, 473.0, 0.08631354834997268, 0.03905463287970769, 0.055350810628074926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86b7436c-6208-4d93-b8ec-091c786510b5", 3, 0, 0.0, 867.6666666666666, 301, 1884, 418.0, 1884.0, 1884.0, 1884.0, 0.017563374509689127, 0.024212529638194483, 0.011262971283882676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5428ad09-eda8-4e34-b5b9-700f1cfbdb88", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 501.00000000000006, 152, 1314, 517.5, 877.4999999999999, 1256.3999999999992, 1314.0, 0.09097638335793831, 0.05588295423060859, 0.04113482958469281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 103.21052631578947, 82, 248, 86.0, 245.0, 248.0, 248.0, 0.09495632009275733, 0.07056812460018391, 0.04766362160905983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 119.21052631578947, 82, 254, 85.0, 248.0, 254.0, 254.0, 0.09495964215208537, 0.1004748763025714, 0.04995923607466826], "isController": false}, {"data": ["login", 22, 0, 0.0, 2184.7272727272725, 1089, 3748, 2194.5, 3416.899999999999, 3744.5499999999997, 3748.0, 0.09117016912066372, 15.001681435629717, 0.15817182572407765], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 98.05882352941177, 85, 247, 89.0, 126.19999999999989, 247.0, 247.0, 0.08880206020779682, 0.07189151163306988, 0.03156635733949027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76537b57-a920-4cfd-96f9-25051efbd010", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d65195fe-cbae-4a7a-a120-1f9663bab0de", 3, 0, 0.0, 768.3333333333334, 229, 1697, 379.0, 1697.0, 1697.0, 1697.0, 0.016258223951615525, 0.022413274230173096, 0.010426009500222197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5fd2ed5-333f-4179-96de-7e6acbb933f5", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.703383122246696, 1.3142724394273126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/785e58d0-ce8e-4639-9228-e2e784a087e2", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.0824947033898307, 2.0226430084745766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 651.8947368421053, 168, 1114, 873.0, 1046.0, 1114.0, 1114.0, 0.09483498712240701, 59.783101426954595, 0.20051536108421344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5171dcb4-ff14-4cdc-bee6-c79cde63ce9b", 3, 0, 0.0, 342.0, 216, 422, 388.0, 422.0, 422.0, 422.0, 0.12054486277976453, 0.054543411218708565, 0.0773025324466589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbb70198-2491-4d5b-8380-2e69df066543", 3, 0, 0.0, 534.3333333333333, 176, 1117, 310.0, 1117.0, 1117.0, 1117.0, 0.04459176241508985, 0.027739211580480698, 0.02859562889248926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 303.00000000000006, 165, 420, 339.5, 397.2000000000001, 420.0, 420.0, 0.12184101777863518, 0.18882978048309962, 0.27402330463300467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 916.6666666666666, 884, 978, 888.0, 978.0, 978.0, 978.0, 0.04697482149567832, 56.19821759911687, 0.10592271761086058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1036417e-ccea-450b-8db8-d7b24cc03b91", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 988.8260869565215, 399, 1639, 960.0, 1466.8000000000002, 1611.5999999999997, 1639.0, 0.09814924659784839, 0.031371753073565, 0.04428217961738864], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 257.52941176470586, 166, 689, 174.0, 537.7999999999998, 689.0, 689.0, 0.08650298944154687, 6.213685440783615, 0.1932453329729042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 98.88235294117646, 83, 249, 89.0, 128.9999999999999, 249.0, 249.0, 0.10085489353876091, 0.07830043004229972, 0.03585076293760642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/848500e8-a738-4419-b1ae-691c0df1e2bb", 3, 0, 0.0, 396.33333333333337, 175, 798, 216.0, 798.0, 798.0, 798.0, 0.026402175539264435, 0.026479525662914626, 0.016931082621207988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 418.88888888888886, 168, 1064, 340.0, 1055.0, 1064.0, 1064.0, 0.13840404754947944, 27.775309018273177, 0.30537195126639705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 85.85714285714285, 83, 90, 86.0, 89.0, 90.0, 90.0, 0.07409759712077908, 0.05506667129776649, 0.037193520429766064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 98.07142857142857, 83, 248, 85.0, 173.5, 248.0, 248.0, 0.07409249919292099, 0.027774350632167787, 0.041811406143326645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 164.78571428571428, 82, 1041, 84.0, 644.0, 1041.0, 1041.0, 0.07372456502506636, 4.756844083406181, 0.04288943026709357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 125.07142857142857, 81, 651, 83.0, 376.5, 651.0, 651.0, 0.07387628887739701, 1.570066960280941, 0.04304984077021308], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 948.0175438596492, 657, 1433, 892.0, 1264.0000000000002, 1390.5, 1433.0, 0.2487855337759097, 297.6339902417148, 0.49125424735829043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 988.8260869565215, 399, 1639, 960.0, 1466.8000000000002, 1611.5999999999997, 1639.0, 0.09581377135501502, 0.030625257759874024, 0.043228478873063414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 100.63636363636364, 82, 256, 84.0, 224.2000000000001, 256.0, 256.0, 0.050011593596697414, 0.01347968733660985, 0.029450186463680215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31057565-204f-4ef3-831e-b639ef79b2a7", 2, 0, 0.0, 180.5, 180, 181, 180.5, 181.0, 181.0, 181.0, 0.09148293843198244, 0.05373729244808344, 0.05686415069527034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 85.36363636363636, 81, 98, 84.0, 95.80000000000001, 98.0, 98.0, 0.05001182097586702, 0.013479748622401658, 0.029401480690890575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 250.23529411764707, 82, 976, 86.0, 972.0, 976.0, 976.0, 0.0991722037813778, 15.769422939916227, 0.056798418640874114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 209.76470588235298, 81, 687, 88.0, 681.4, 687.0, 687.0, 0.0993408442803048, 5.176669200101679, 0.056992015844864664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 84.18181818181819, 82, 88, 84.0, 87.4, 88.0, 88.0, 0.05001182097586702, 0.013382069284558169, 0.028522366650299162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 95.29411764705883, 82, 254, 85.0, 122.79999999999988, 254.0, 254.0, 0.09968745052277271, 0.07408413071077152, 0.05003842731318865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 85.0909090909091, 82, 89, 85.0, 88.4, 89.0, 89.0, 0.05001182097586702, 0.03716698804944805, 0.025103589825777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 102.94117647058822, 81, 249, 85.0, 243.4, 249.0, 249.0, 0.09968686596221282, 0.053096083478954344, 0.055375229426390046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 106.0909090909091, 83, 244, 92.0, 216.60000000000008, 244.0, 244.0, 0.05196621251346398, 0.04090309305258981, 0.018472364604395396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76537b57-a920-4cfd-96f9-25051efbd010", 3, 0, 0.0, 389.66666666666663, 190, 724, 255.0, 724.0, 724.0, 724.0, 0.020085564504790408, 0.027689572160738078, 0.012880391300272496], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 530.6923076923077, 345, 1117, 424.0, 989.3999999999999, 1117.0, 1117.0, 0.08493956223456388, 0.015345526380267885, 0.05781530749754982], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1228.4545454545453, 711, 1832, 1201.0, 1747.9999999999998, 1827.5, 1832.0, 0.08920678944764779, 0.046171482819583325, 0.04103163850570518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 188.0, 167, 342, 172.0, 310.2000000000001, 342.0, 342.0, 0.04999250112483127, 0.07747861258311253, 0.11243430672899066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffc60513-0dfe-4aed-975a-4cbd1a62dca7", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["addBook", 62, 4, 6.451612903225806, 924.9677419354837, 438, 2487, 766.5, 1482.6000000000001, 1615.55, 2487.0, 0.275804392407372, 96.84020124267673, 1.0012766379222142], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 155.42105263157887, 82, 351, 88.0, 339.6, 348.1, 351.0, 0.24969554665802227, 0.18556475684253412, 0.1207024371051963], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 536.5614035087717, 407, 829, 491.0, 720.6, 746.8, 829.0, 0.24936673972674656, 73.32210123469348, 0.12541393648366647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88aec457-2a7b-4a61-827e-6d22a1d69878", 3, 0, 0.0, 290.6666666666667, 236, 382, 254.0, 382.0, 382.0, 382.0, 0.03413590642210186, 0.028457700633789995, 0.021890538949069227], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 140.24561403508773, 83, 340, 90.0, 258.2, 272.49999999999966, 340.0, 0.25, 0.4423828125, 0.12158203125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6494b945-8266-4101-9882-4a40366a5d4c", 3, 0, 0.0, 350.0, 284, 421, 345.0, 421.0, 421.0, 421.0, 0.02733086748173387, 0.02741093838255926, 0.017526630514002512], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 791.2280701754387, 566, 1095, 756.0, 1038.8, 1056.6, 1095.0, 0.24918904267690234, 224.22073862829083, 0.12508121868742952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 91.44444444444446, 84, 115, 88.0, 115.0, 115.0, 115.0, 0.13483348065139553, 0.10073009052570077, 0.04792908882530076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1706689a-099d-447e-8465-012695bdad2b", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 4, 2.2099447513812156, 151.64640883977907, 83, 1070, 91.0, 285.6000000000001, 366.6000000000001, 869.9200000000017, 0.7492652233307117, 1.5861004962329759, 0.36209257409860496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 119.57142857142857, 84, 250, 94.5, 248.5, 250.0, 250.0, 0.07461612667686421, 0.05778377778784503, 0.02652370127966657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=557f24e1-c61d-48ca-87c7-d7c040bb9d42", 1, 0, 0.0, 1079.0, 1079, 1079, 1079.0, 1079.0, 1079.0, 1079.0, 0.9267840593141798, 0.1674365732159407, 0.6389741658943466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 89.08333333333333, 84, 110, 87.0, 104.90000000000002, 110.0, 110.0, 0.12734392410302123, 0.10334257903282289, 0.04526678552099583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 252.71428571428572, 168, 1124, 172.0, 729.0, 1124.0, 1124.0, 0.07369157968428422, 6.403246204554666, 0.1643873268905838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 376.6470588235294, 168, 1230, 178.0, 1093.9999999999998, 1230.0, 1230.0, 0.0991230525235563, 21.053387876521832, 0.21845449851023885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d65195fe-cbae-4a7a-a120-1f9663bab0de", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1036417e-ccea-450b-8db8-d7b24cc03b91", 3, 0, 0.0, 271.3333333333333, 188, 431, 195.0, 431.0, 431.0, 431.0, 0.03548322234969898, 0.029234386642932333, 0.022754540373993163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5171dcb4-ff14-4cdc-bee6-c79cde63ce9b", 1, 0, 0.0, 1139.0, 1139, 1139, 1139.0, 1139.0, 1139.0, 1139.0, 0.8779631255487269, 0.15861638498683056, 0.6053144205443372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 92.81818181818181, 85, 122, 89.0, 117.00000000000001, 122.0, 122.0, 0.08544883944939874, 0.07084576630130815, 0.03037439214802846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4470093-472e-44fd-8494-7309f779156b", 2, 0, 0.0, 274.0, 258, 290, 274.0, 290.0, 290.0, 290.0, 0.025011567850130687, 0.028455543501369387, 0.015546741149031429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 90.36842105263159, 84, 116, 89.0, 102.0, 116.0, 116.0, 0.09561769027920367, 0.07423443727731144, 0.03398910084143567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 104.88888888888889, 82, 267, 86.0, 245.40000000000003, 267.0, 267.0, 0.13849562969346302, 0.1029249748014896, 0.06951831412347656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 178.66666666666663, 81, 263, 244.5, 262.1, 263.0, 263.0, 0.1386652697424678, 0.07181524875008667, 0.0771415839810799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 269.66666666666663, 82, 981, 92.0, 968.4, 981.0, 981.0, 0.13866420152530623, 20.826193992662354, 0.07953330829674139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 220.11111111111111, 82, 659, 85.5, 658.1, 659.0, 659.0, 0.13866313332460267, 6.826405914175224, 0.07966810882744914], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 42.857142857142854, 0.2245508982035928], "isController": false}, {"data": ["401/Unauthorized", 4, 57.142857142857146, 0.2994011976047904], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 7, "401/Unauthorized", 4, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

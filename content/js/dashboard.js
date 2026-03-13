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

    var data = {"OkPercent": 98.73417721518987, "KoPercent": 1.2658227848101267};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8306709265175719, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ab78f15-5e9d-4cb0-842f-5aa9b200b933"], "isController": false}, {"data": [0.475, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bcefa8c-4bdd-4a21-9298-f3495077262e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95a61207-28c5-415c-b40b-ff55181bc755"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c78c8810-a84b-445f-9474-759973d3f625"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a77610a7-ab21-4099-b6d3-ed6e2787eca1"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a871f2f1-e540-462f-b005-4dffa4c7201b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72b22955-9a46-4ff5-b558-c43ba393321b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7020557b-ed1a-4abc-9e91-faad8d1bfe79"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c18703ec-e9b5-4b75-bf8d-18e720f460cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f30289bc-1153-452e-967b-242fc56a4241"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4323fafe-ecd3-42a9-bbdf-bf5134d2703b"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95a61207-28c5-415c-b40b-ff55181bc755"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=026ff921-4d17-4ea6-85d5-6f821f07c0e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eff2b445-9c07-4a4c-ab92-4c8e95a296b5"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=073f90ae-2692-479b-b476-522a22d4be49"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e89e909f-705a-4ce6-8856-25e592d33f74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ab78f15-5e9d-4cb0-842f-5aa9b200b933"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a77610a7-ab21-4099-b6d3-ed6e2787eca1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c78c8810-a84b-445f-9474-759973d3f625"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72b22955-9a46-4ff5-b558-c43ba393321b"], "isController": false}, {"data": [0.40350877192982454, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7020557b-ed1a-4abc-9e91-faad8d1bfe79"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a871f2f1-e540-462f-b005-4dffa4c7201b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/714c7b17-7ac4-4514-a4fe-f6f75d3e5804"], "isController": false}, {"data": [0.9425287356321839, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f30289bc-1153-452e-967b-242fc56a4241"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4323fafe-ecd3-42a9-bbdf-bf5134d2703b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c18703ec-e9b5-4b75-bf8d-18e720f460cb"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eff2b445-9c07-4a4c-ab92-4c8e95a296b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/026ff921-4d17-4ea6-85d5-6f821f07c0e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4bcefa8c-4bdd-4a21-9298-f3495077262e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/073f90ae-2692-479b-b476-522a22d4be49"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1343, 17, 1.2658227848101267, 283.6954579300077, 83, 1789, 101.0, 688.0, 859.0, 1366.7599999999948, 5.240014514411015, 750.2647608901976, 3.8328183464886436], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9ab78f15-5e9d-4cb0-842f-5aa9b200b933", 3, 0, 0.0, 280.6666666666667, 181, 471, 190.0, 471.0, 471.0, 471.0, 0.033350749836025484, 0.02780314789390015, 0.021387036841461652], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1244.3833333333334, 1023, 1883, 1213.0, 1458.0, 1532.2499999999998, 1883.0, 0.25843354812032665, 310.98306573795696, 1.2707157370955515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bcefa8c-4bdd-4a21-9298-f3495077262e", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95a61207-28c5-415c-b40b-ff55181bc755", 3, 0, 0.0, 251.0, 182, 381, 190.0, 381.0, 381.0, 381.0, 0.01764041772509173, 0.02431873993026155, 0.01131237725209333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c78c8810-a84b-445f-9474-759973d3f625", 3, 0, 0.0, 377.0, 278, 514, 339.0, 514.0, 514.0, 514.0, 0.02351815993916636, 0.023587060798363136, 0.015081632513072176], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 544.2666666666668, 122, 1409, 451.0, 1157.0000000000002, 1409.0, 1409.0, 0.07796257796257797, 0.014678891632016631, 0.052741480964137215], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 544.2666666666668, 122, 1409, 451.0, 1157.0000000000002, 1409.0, 1409.0, 0.07769363844488414, 0.01462825536345084, 0.05255954408078067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 109.43750000000001, 84, 287, 86.5, 263.20000000000005, 287.0, 287.0, 0.07869213668824143, 0.02844328817552281, 0.04446605233518915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 87.81250000000001, 84, 97, 87.0, 93.5, 97.0, 97.0, 0.0786929107524026, 0.05848174324470544, 0.03950015246751458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 143.37500000000003, 84, 418, 87.0, 362.70000000000005, 418.0, 418.0, 0.07869329779019384, 1.4660373098450235, 0.045917231864883605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 160.12499999999997, 83, 765, 87.5, 408.7000000000004, 765.0, 765.0, 0.07869329779019384, 4.4454076389674455, 0.045840382941260374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a77610a7-ab21-4099-b6d3-ed6e2787eca1", 3, 0, 0.0, 409.66666666666663, 274, 679, 276.0, 679.0, 679.0, 679.0, 0.022726584042907793, 0.02686205294915306, 0.014574013855640739], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 255.66666666666669, 101, 1035, 182.0, 589.8000000000002, 1035.0, 1035.0, 0.07792976969155398, 0.16156728618668856, 0.05037530490022392], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 99.31250000000001, 85, 261, 87.5, 149.0000000000001, 261.0, 261.0, 0.14720630042965838, 0.10939843225290043, 0.07389066252035587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 119.43749999999999, 84, 262, 87.0, 262.0, 262.0, 262.0, 0.14697236919459142, 0.05312319155092592, 0.0830487178957231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 557.6, 416, 602, 589.0, 602.0, 602.0, 602.0, 0.05866960796967955, 17.250812757412906, 0.03346001079520787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a871f2f1-e540-462f-b005-4dffa4c7201b", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 699.4, 587, 786, 758.0, 786.0, 786.0, 786.0, 0.05853978363695968, 52.67420021849974, 0.033328802597995595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 153.2, 85, 256, 86.0, 256.0, 256.0, 256.0, 0.05901794145420208, 0.10443409171388102, 0.032678879691926344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 89.0, 84, 103, 88.0, 95.0, 103.0, 103.0, 0.08202772537117546, 0.06096005762447707, 0.0411740730867033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 146.94117647058826, 84, 263, 88.0, 262.2, 263.0, 263.0, 0.0819687939979556, 0.02917501422399661, 0.046342880889698936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 165.70588235294116, 84, 579, 88.0, 322.19999999999976, 579.0, 579.0, 0.08184054573201555, 4.352541427263011, 0.04769957358668599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 137.23529411764707, 84, 604, 87.0, 327.9999999999998, 604.0, 604.0, 0.0818306971012679, 1.4361080508168629, 0.04777374624541507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 153.8, 86, 256, 86.0, 256.0, 256.0, 256.0, 0.05901794145420208, 0.04386001313149197, 0.0331399573595373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 117.1875, 84, 575, 86.0, 237.60000000000034, 575.0, 575.0, 0.1472090091913625, 8.315880416256475, 0.08575212302992943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 460.05882352941177, 86, 928, 589.0, 795.9999999999999, 928.0, 928.0, 0.08287629494210846, 43.87521899756246, 0.044532678244972576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 150.12499999999997, 84, 596, 86.0, 360.80000000000024, 596.0, 596.0, 0.14697506935386084, 2.738110377128842, 0.08575937884661315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 352.764705882353, 85, 598, 421.0, 596.4, 598.0, 598.0, 0.08287589091582734, 14.343470598558934, 0.044613394633054804], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 514.2666666666667, 90, 1411, 403.0, 1073.2000000000003, 1411.0, 1411.0, 0.07792045879566138, 0.014670961382620622, 0.053352178720961645], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 278.5882352941177, 173, 688, 192.0, 419.9999999999998, 688.0, 688.0, 0.08178935872331623, 5.875095771730711, 0.1827152097536216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72b22955-9a46-4ff5-b558-c43ba393321b", 3, 0, 0.0, 244.66666666666666, 171, 361, 202.0, 361.0, 361.0, 361.0, 0.023940818297169396, 0.024010957413274386, 0.015352673191869698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7020557b-ed1a-4abc-9e91-faad8d1bfe79", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 556.1428571428571, 103, 1436, 474.0, 1103.6000000000001, 1404.1999999999996, 1436.0, 0.09121234233295111, 0.056027893874439696, 0.04124151806655895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 87.47058823529412, 85, 92, 87.0, 90.4, 92.0, 92.0, 0.08287629494210846, 0.061590684034125535, 0.04160001523461304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c18703ec-e9b5-4b75-bf8d-18e720f460cb", 1, 0, 0.0, 1411.0, 1411, 1411, 1411.0, 1411.0, 1411.0, 1411.0, 0.7087172218284905, 0.12803973245924877, 0.48862730333097093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 157.94117647058823, 86, 271, 88.0, 267.8, 271.0, 271.0, 0.08287629494210846, 0.09539724253503962, 0.043171084704448505], "isController": false}, {"data": ["login", 21, 0, 0.0, 2128.6190476190477, 1300, 3448, 2024.0, 2919.4, 3396.999999999999, 3448.0, 0.09508070540828108, 27.213982346399384, 0.18099556714508863], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 101.5625, 86, 258, 90.0, 148.80000000000013, 258.0, 258.0, 0.1430487259722843, 0.11580800178810909, 0.05084935181046044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f30289bc-1153-452e-967b-242fc56a4241", 3, 0, 0.0, 348.0, 172, 486, 386.0, 486.0, 486.0, 486.0, 0.04204212621046289, 0.026153158589907088, 0.026960608279496055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4323fafe-ecd3-42a9-bbdf-bf5134d2703b", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 559.0000000000001, 174, 1018, 680.0, 884.3999999999999, 1018.0, 1018.0, 0.08283994834685574, 58.35014592165533, 0.1738411163292157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95a61207-28c5-415c-b40b-ff55181bc755", 1, 0, 0.0, 848.0, 848, 848, 848.0, 848.0, 848.0, 848.0, 1.1792452830188678, 0.21304724351415094, 0.813034345518868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=026ff921-4d17-4ea6-85d5-6f821f07c0e2", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eff2b445-9c07-4a4c-ab92-4c8e95a296b5", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 286.5, 172, 850, 181.0, 553.9000000000003, 850.0, 850.0, 0.07865731955519285, 5.995628258440914, 0.17564432942177038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=073f90ae-2692-479b-b476-522a22d4be49", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 640.1428571428571, 95, 1043, 688.0, 1043.0, 1043.0, 1043.0, 0.07849645644568044, 67.08389519040998, 0.14128924121961065], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1049.0833333333333, 206, 1674, 1083.0, 1630.5, 1671.0, 1674.0, 0.09448446911538916, 0.02994161155072635, 0.04262873508916972], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e89e909f-705a-4ce6-8856-25e592d33f74", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 91.30000000000001, 86, 104, 90.5, 95.80000000000001, 103.6, 104.0, 0.08440064988500412, 0.06552589517439285, 0.030001793513810056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 262.25, 173, 685, 178.5, 571.6000000000001, 685.0, 685.0, 0.14685231246500785, 11.193769116614503, 0.32792594627958843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 285.1875, 173, 924, 179.0, 521.5000000000005, 924.0, 924.0, 0.09147300117199783, 6.972499365763371, 0.2042621594774605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 108.88888888888889, 85, 255, 89.0, 255.0, 255.0, 255.0, 0.053081373745952544, 0.03944816935612294, 0.026644361431073838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 125.0, 85, 257, 88.0, 257.0, 257.0, 257.0, 0.053087322747327935, 0.014205006281999857, 0.030276363754335463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 105.66666666666669, 86, 251, 87.0, 251.0, 251.0, 251.0, 0.05308763588960131, 0.014308776860869104, 0.031209723442910144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 104.88888888888889, 84, 255, 87.0, 255.0, 255.0, 255.0, 0.05308763588960131, 0.014308776860869104, 0.03126156683733358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 3.2769097222222223, 6.868489583333334], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 799.4499999999997, 660, 1495, 690.5, 1090.8999999999999, 1167.9499999999998, 1495.0, 0.25577519065909005, 305.9960498718993, 0.5050560893678516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1049.0833333333333, 206, 1674, 1083.0, 1630.5, 1671.0, 1674.0, 0.09613728404161141, 0.030465379562014557, 0.0433744386984614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 87.83333333333334, 85, 91, 87.5, 91.0, 91.0, 91.0, 0.04853465779021703, 0.013081606982519433, 0.028580467429200066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ab78f15-5e9d-4cb0-842f-5aa9b200b933", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 117.5, 85, 259, 90.0, 259.0, 259.0, 259.0, 0.048466832530937996, 0.013063325955604381, 0.02849319646838347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 136.40000000000003, 84, 755, 86.0, 253.5, 729.9499999999996, 755.0, 0.0856864988068155, 3.876983542033512, 0.050006105163039986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 145.50000000000003, 84, 586, 86.5, 258.0, 569.5999999999998, 586.0, 0.08568686591719221, 1.281679706244002, 0.05008999798635865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a77610a7-ab21-4099-b6d3-ed6e2787eca1", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 105.35000000000001, 84, 265, 87.0, 245.40000000000035, 264.85, 265.0, 0.08568209372764234, 0.06367585285814044, 0.04300839470313297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 86.66666666666666, 85, 89, 86.0, 89.0, 89.0, 89.0, 0.04853465779021703, 0.012986812729022915, 0.02767992202098315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 121.0, 83, 260, 87.0, 256.0, 259.8, 260.0, 0.08568686591719221, 0.029362813721037842, 0.048508472824410474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 88.16666666666667, 85, 92, 88.0, 92.0, 92.0, 92.0, 0.04853387259858443, 0.036068629929221434, 0.024361729019211326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 91.83333333333333, 87, 100, 90.0, 100.0, 100.0, 100.0, 0.04766179192450372, 0.03751504325307617, 0.01694227759816343], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 462.2666666666667, 95, 1208, 418.0, 890.6000000000001, 1208.0, 1208.0, 0.07953340402969247, 0.014829665959703076, 0.054130351935312834], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c78c8810-a84b-445f-9474-759973d3f625", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1131.4761904761904, 665, 1789, 1111.0, 1627.6000000000001, 1775.3999999999999, 1789.0, 0.09434174172825087, 0.04882922179294234, 0.04339351597070914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 207.0, 175, 347, 180.0, 347.0, 347.0, 347.0, 0.04843240450744245, 0.07506076753253044, 0.1089256128717187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72b22955-9a46-4ff5-b558-c43ba393321b", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 862.0350877192981, 453, 1939, 767.0, 1433.4, 1511.6999999999998, 1939.0, 0.27778860774299197, 88.5348006379391, 1.0095156304826698], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7020557b-ed1a-4abc-9e91-faad8d1bfe79", 3, 0, 0.0, 769.0, 480, 1035, 792.0, 1035.0, 1035.0, 1035.0, 0.08066467693796887, 0.036498665671802315, 0.051728324729101126], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 149.91666666666669, 85, 598, 89.0, 342.9, 348.0, 598.0, 0.25641902287257684, 0.19056140274026465, 0.1239525550018804], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 484.99999999999994, 408, 673, 428.5, 611.4, 656.1999999999998, 673.0, 0.25647492316438764, 75.41214317926314, 0.12898885295865198], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 130.24999999999997, 83, 343, 90.0, 255.9, 259.95, 343.0, 0.25702205677617235, 0.4548085614047112, 0.12499705495559943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a871f2f1-e540-462f-b005-4dffa4c7201b", 3, 0, 0.0, 285.0, 187, 479, 189.0, 479.0, 479.0, 479.0, 0.04300088868503282, 0.03495221974170799, 0.0275754396840868], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 645.8166666666666, 570, 855, 595.5, 771.7, 831.5499999999998, 855.0, 0.2564891761567662, 230.7894115657382, 0.12874554350056427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 112.81250000000001, 88, 264, 91.0, 262.6, 264.0, 264.0, 0.09794739000814187, 0.07317358726194192, 0.03481723629195668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/714c7b17-7ac4-4514-a4fe-f6f75d3e5804", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, 4.597701149425287, 156.45977011494253, 85, 1009, 95.0, 285.5, 350.25, 994.75, 0.7158402277523851, 1.6060805343397608, 0.34064040830662645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 115.1111111111111, 87, 302, 92.0, 302.0, 302.0, 302.0, 0.05207037600597074, 0.040324031418686325, 0.01850939147087241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 102.25, 87, 258, 90.5, 150.2000000000001, 258.0, 258.0, 0.07699896532640343, 0.06248646502562622, 0.02737072595586997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f30289bc-1153-452e-967b-242fc56a4241", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4323fafe-ecd3-42a9-bbdf-bf5134d2703b", 3, 0, 0.0, 590.6666666666667, 271, 1208, 293.0, 1208.0, 1208.0, 1208.0, 0.045609340792994404, 0.02932241147987108, 0.02924817752675748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c18703ec-e9b5-4b75-bf8d-18e720f460cb", 3, 0, 0.0, 268.6666666666667, 172, 458, 176.0, 458.0, 458.0, 458.0, 0.0389529448426301, 0.03224522745273709, 0.02497959027994183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 235.33333333333334, 174, 512, 180.0, 512.0, 512.0, 512.0, 0.05305383785568177, 0.08222308659860056, 0.11931932478675304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 277.85, 172, 1021, 179.5, 501.9000000000004, 995.8999999999996, 1021.0, 0.08565053724299485, 5.249495498261294, 0.1915343410475917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eff2b445-9c07-4a4c-ab92-4c8e95a296b5", 3, 0, 0.0, 325.3333333333333, 221, 418, 337.0, 418.0, 418.0, 418.0, 0.026834351547894843, 0.026912967812195317, 0.017208226741325796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/026ff921-4d17-4ea6-85d5-6f821f07c0e2", 3, 0, 0.0, 362.3333333333333, 179, 538, 370.0, 538.0, 538.0, 538.0, 0.03134828995078318, 0.026133779480454342, 0.020102907292657186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 112.05882352941177, 88, 269, 91.0, 261.0, 269.0, 269.0, 0.08292804284940755, 0.06875576990151075, 0.02947832773162534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 101.47058823529412, 86, 268, 90.0, 142.3999999999999, 268.0, 268.0, 0.08006706794397189, 0.062161444351032866, 0.02846134055820876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bcefa8c-4bdd-4a21-9298-f3495077262e", 3, 0, 0.0, 291.6666666666667, 170, 443, 262.0, 443.0, 443.0, 443.0, 0.021263475727742457, 0.025132708452940387, 0.013635757546761927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/073f90ae-2692-479b-b476-522a22d4be49", 3, 0, 0.0, 244.66666666666666, 182, 366, 186.0, 366.0, 366.0, 366.0, 0.03661707087844353, 0.030526145351462853, 0.02348165027035604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 97.37500000000001, 85, 254, 86.0, 142.0000000000001, 254.0, 254.0, 0.09151904454117499, 0.06801366493733806, 0.04593827040445698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 107.625, 84, 256, 85.5, 253.9, 256.0, 256.0, 0.09151956802763891, 0.03307976573850572, 0.05171436528319587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 170.37499999999997, 84, 583, 87.0, 358.30000000000024, 583.0, 583.0, 0.09151904454117499, 5.169937861786223, 0.05331163092657313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 175.4375, 84, 669, 87.0, 384.8000000000003, 669.0, 669.0, 0.09151852106069966, 1.7049681508396823, 0.053400699544695354], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.37230081906180196], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07446016381236038], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07446016381236038], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7446016381236039], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1343, 17, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 97.70290964777948, "KoPercent": 2.2970903522205206};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7800653594771242, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.125, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=956d0601-3e8d-4a7f-9372-d9864e4ebc1b"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a697d47a-476b-46f4-8584-00a472723150"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8aaaed21-22f4-48e4-b593-3259ead421d6"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53176531-1b7e-4c57-96a7-16db0e1ae85a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c0a1a79-dda2-4a11-9b65-eb49b66526c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a15f5012-4d6e-44b8-ab88-8c9734cc95e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51aa739c-4584-4dee-8e46-539cef5e53f7"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0006749-7ca2-412d-85eb-f165c1ee123b"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/350805b5-4619-4273-b111-67b0a2b6212c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18701fb3-d2e6-4a82-83f0-387c76dad758"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f439aae-de48-4d1c-9ea7-6cee49cedfe2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8aaaed21-22f4-48e4-b593-3259ead421d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a697d47a-476b-46f4-8584-00a472723150"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c1a089b-a248-4d54-a092-205443d4ebf9"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7652c03a-eaab-4bf5-baff-3c4cbfc7b08d"], "isController": false}, {"data": [0.34, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0006749-7ca2-412d-85eb-f165c1ee123b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/956d0601-3e8d-4a7f-9372-d9864e4ebc1b"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f439aae-de48-4d1c-9ea7-6cee49cedfe2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23f9a11d-244e-425a-bfcb-8aab54171481"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dabb7751-975e-4073-8b98-e8610e3efbea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51aa739c-4584-4dee-8e46-539cef5e53f7"], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91fb3c21-ef50-493c-b964-5e2a9ad5f1cc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a15f5012-4d6e-44b8-ab88-8c9734cc95e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53176531-1b7e-4c57-96a7-16db0e1ae85a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18701fb3-d2e6-4a82-83f0-387c76dad758"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c1a089b-a248-4d54-a092-205443d4ebf9"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=350805b5-4619-4273-b111-67b0a2b6212c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23f9a11d-244e-425a-bfcb-8aab54171481"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7652c03a-eaab-4bf5-baff-3c4cbfc7b08d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 30, 2.2970903522205206, 349.13629402756465, 108, 2848, 127.0, 902.8999999999999, 1101.8999999999992, 1426.6000000000013, 5.082423997135785, 738.8791837998222, 3.708040845458897], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1623.2321428571431, 1339, 2085, 1592.0, 1943.6, 2046.75, 2085.0, 0.2536208911151167, 305.19130526869094, 1.247051940199817], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=956d0601-3e8d-4a7f-9372-d9864e4ebc1b", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 474.0, 117, 950, 487.5, 837.3000000000001, 950.0, 950.0, 0.08341022713647477, 0.01685615613091235, 0.055944518188642656], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 474.0, 117, 950, 487.5, 837.3000000000001, 950.0, 950.0, 0.08277631769550732, 0.01672805101866606, 0.055519345407466426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 124.83333333333334, 110, 326, 112.5, 140.6000000000003, 326.0, 326.0, 0.10254891013297175, 0.035996714874149696, 0.05800645274774107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 115.11111111111111, 112, 127, 115.0, 117.10000000000002, 127.0, 127.0, 0.10254774167084453, 0.07620979630030537, 0.05147415939337314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 208.2222222222222, 110, 797, 113.0, 500.9000000000005, 797.0, 797.0, 0.1025483258985797, 1.7012495762760147, 0.059897747212679535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 199.2222222222222, 109, 992, 114.0, 407.0000000000009, 992.0, 992.0, 0.1025483258985797, 5.152391307676313, 0.0597976023631692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a697d47a-476b-46f4-8584-00a472723150", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8aaaed21-22f4-48e4-b593-3259ead421d6", 3, 0, 0.0, 339.0, 192, 430, 395.0, 430.0, 430.0, 430.0, 0.023361574881634685, 0.02761259062344256, 0.01498121826719412], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 261.6875, 111, 1215, 206.5, 617.9000000000005, 1215.0, 1215.0, 0.08363214401455199, 0.1441511076032073, 0.054051560850225285], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/53176531-1b7e-4c57-96a7-16db0e1ae85a", 3, 0, 0.0, 375.6666666666667, 227, 615, 285.0, 615.0, 615.0, 615.0, 0.01602324438652338, 0.022089335929989105, 0.010275322734847351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c0a1a79-dda2-4a11-9b65-eb49b66526c4", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 116.33333333333336, 109, 128, 116.0, 123.2, 128.0, 128.0, 0.07289338128097968, 0.05417174136213432, 0.036589060525804254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 158.2, 110, 351, 113.0, 344.4, 351.0, 351.0, 0.07289338128097968, 0.02680350374186024, 0.04116387950724074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 655.5714285714286, 550, 788, 569.0, 788.0, 788.0, 788.0, 0.04929022082018927, 14.492961510498818, 0.028110829061514197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 901.5714285714286, 772, 1007, 988.0, 1007.0, 1007.0, 1007.0, 0.04913866932483468, 44.21506103505342, 0.027976410367557245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 145.0, 111, 328, 115.0, 328.0, 328.0, 328.0, 0.04937400811144419, 0.08736885029095397, 0.027338928319520367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 114.25, 109, 118, 115.0, 117.7, 118.0, 118.0, 0.07420783139980706, 0.05514859345239568, 0.03724885287060628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 149.16666666666669, 109, 337, 114.5, 332.20000000000005, 337.0, 337.0, 0.07420874921153203, 0.02914480987100046, 0.04180281266619668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 206.33333333333331, 109, 1015, 113.0, 812.5000000000007, 1015.0, 1015.0, 0.07420966704596052, 5.5828340768472025, 0.043095718102211446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 205.41666666666666, 109, 777, 114.0, 646.2000000000005, 777.0, 777.0, 0.0742092081259083, 1.836665822794595, 0.043167921523762406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a15f5012-4d6e-44b8-ab88-8c9734cc95e4", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.26685976735598227, 1.0183945716395864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 147.14285714285714, 111, 335, 116.0, 335.0, 335.0, 335.0, 0.04944515472801633, 0.0367458620586137, 0.027764613250595108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 175.33333333333334, 111, 789, 115.0, 521.4000000000001, 789.0, 789.0, 0.07289338128097968, 4.390976748529983, 0.04243571714938284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 553.4999999999999, 110, 1138, 438.5, 1026.2, 1132.4499999999998, 1138.0, 0.09927923277008915, 44.67919350825507, 0.05409942566963843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 159.2, 110, 551, 114.0, 421.4000000000001, 551.0, 551.0, 0.0728940897472033, 1.4472229326021246, 0.04250731522563151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 416.15, 111, 819, 446.5, 793.5, 817.75, 819.0, 0.09928071124701537, 14.609292395345719, 0.05419718514363436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51aa739c-4584-4dee-8e46-539cef5e53f7", 3, 0, 0.0, 263.6666666666667, 204, 381, 206.0, 381.0, 381.0, 381.0, 0.05580668564093978, 0.03587832166043492, 0.035787490466357874], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 435.0, 116, 1852, 386.5, 1029.500000000001, 1852.0, 1852.0, 0.082932063090567, 0.01675952520098067, 0.056069242117566566], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0006749-7ca2-412d-85eb-f165c1ee123b", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 359.9166666666667, 224, 1126, 232.0, 924.7000000000007, 1126.0, 1126.0, 0.07415509538199143, 7.498288301492989, 0.1651954411610216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 426.0869565217391, 121, 900, 373.0, 774.8000000000001, 879.1999999999997, 900.0, 0.0982926985619351, 0.06037705800337614, 0.044442890072437444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 115.25, 111, 123, 115.0, 117.0, 122.69999999999999, 123.0, 0.09927479760350638, 0.07377746189088706, 0.04983129489082254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 183.3, 110, 351, 116.5, 348.7, 350.9, 351.0, 0.0992802184164805, 0.10112233184413007, 0.052451756018863246], "isController": false}, {"data": ["login", 23, 0, 0.0, 2230.3478260869565, 1510, 4165, 2224.0, 2726.6, 3877.7999999999956, 4165.0, 0.09701898619377645, 35.45653842716405, 0.19534380707774596], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 135.9333333333333, 115, 349, 118.0, 226.00000000000006, 349.0, 349.0, 0.07388179897255046, 0.05981251108226985, 0.026262670728523795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/350805b5-4619-4273-b111-67b0a2b6212c", 3, 0, 0.0, 283.3333333333333, 200, 443, 207.0, 443.0, 443.0, 443.0, 0.08271982794275788, 0.03839794096561612, 0.0530462438304795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18701fb3-d2e6-4a82-83f0-387c76dad758", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f439aae-de48-4d1c-9ea7-6cee49cedfe2", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 694.05, 227, 1262, 680.0, 1141.3, 1256.0, 1262.0, 0.0992181608921697, 59.42659150580923, 0.21045102095487558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8aaaed21-22f4-48e4-b593-3259ead421d6", 1, 0, 0.0, 1852.0, 1852, 1852, 1852.0, 1852.0, 1852.0, 1852.0, 0.5399568034557236, 0.09755078968682505, 0.3722749055075594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a697d47a-476b-46f4-8584-00a472723150", 3, 0, 0.0, 306.6666666666667, 202, 450, 268.0, 450.0, 450.0, 450.0, 0.04600098135426889, 0.02957419862457066, 0.029499327235647698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 361.0, 226, 1107, 235.5, 636.3000000000008, 1107.0, 1107.0, 0.10248118331606336, 6.961286798929072, 0.22902587365208776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c1a089b-a248-4d54-a092-205443d4ebf9", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 618.9230769230769, 111, 1326, 894.0, 1245.1999999999998, 1326.0, 1326.0, 0.0911775226365734, 58.746653171224374, 0.13858819058206326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7652c03a-eaab-4bf5-baff-3c4cbfc7b08d", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["register", 25, 7, 28.0, 831.0400000000001, 126, 1505, 918.0, 1307.4000000000005, 1481.8999999999999, 1505.0, 0.09758687183330601, 0.030678872832595575, 0.04402845194041736], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 117.16666666666667, 112, 126, 116.0, 124.80000000000001, 126.0, 126.0, 0.06134561608891025, 0.047626723428402, 0.021806449469104813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 321.93333333333334, 226, 908, 232.0, 638.0000000000002, 908.0, 908.0, 0.07285231378948596, 5.915826057208494, 0.16260389802375957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0006749-7ca2-412d-85eb-f165c1ee123b", 3, 0, 0.0, 260.6666666666667, 191, 380, 211.0, 380.0, 380.0, 380.0, 0.027095865170974908, 0.022588707911089433, 0.01737592916237649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/956d0601-3e8d-4a7f-9372-d9864e4ebc1b", 3, 0, 0.0, 333.3333333333333, 190, 505, 305.0, 505.0, 505.0, 505.0, 0.07958192959651962, 0.03600875069634188, 0.051033984799851446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 445.8, 225, 1132, 449.0, 855.4000000000002, 1132.0, 1132.0, 0.11934693357945324, 9.691328425853728, 0.26637831535835904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 135.1818181818182, 111, 345, 113.0, 300.40000000000015, 345.0, 345.0, 0.05164173779142371, 0.038378283651634225, 0.02592173166483573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 173.72727272727272, 109, 340, 115.0, 339.0, 340.0, 340.0, 0.05158918127969309, 0.02084818476430779, 0.029028074480707988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 235.8181818181818, 113, 778, 115.0, 691.0000000000002, 778.0, 778.0, 0.05148221991332266, 4.223868422268868, 0.029863709598157873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 192.90909090909088, 108, 785, 112.0, 693.4000000000003, 785.0, 785.0, 0.051480533338325384, 1.3887038400967835, 0.029913005211233988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 119.0, 116, 124, 117.0, 124.0, 124.0, 124.0, 0.0350573772407507, 0.010339187428424521, 0.02167121073573749], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1058.660714285714, 867, 1619, 916.5, 1459.9, 1578.05, 1619.0, 0.2502737368997341, 299.41439856092603, 0.49419286719849836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 831.0400000000001, 126, 1505, 918.0, 1307.4000000000005, 1481.8999999999999, 1505.0, 0.0981188651179585, 0.0308461182214582, 0.04426847234814143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 136.88888888888889, 110, 331, 113.0, 331.0, 331.0, 331.0, 0.043030082809003806, 0.011597952007114307, 0.02533900384163017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 137.44444444444446, 112, 327, 114.0, 327.0, 327.0, 327.0, 0.043074566861299894, 0.011609941849334737, 0.025323134033693885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f439aae-de48-4d1c-9ea7-6cee49cedfe2", 3, 0, 0.0, 273.0, 195, 412, 212.0, 412.0, 412.0, 412.0, 0.02140380416946105, 0.025674810665515618, 0.013725746814400478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23f9a11d-244e-425a-bfcb-8aab54171481", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 206.66666666666666, 111, 796, 113.0, 657.1000000000005, 796.0, 796.0, 0.06063576600657898, 4.561662034241523, 0.03521295786319561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 205.08333333333334, 110, 773, 113.5, 641.9000000000005, 773.0, 773.0, 0.060634234088566406, 1.500687424838814, 0.03527128135295188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 152.33333333333334, 111, 344, 116.0, 339.20000000000005, 344.0, 344.0, 0.06070109767818301, 0.045110874348727806, 0.03046910567049421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 163.33333333333334, 111, 334, 116.0, 334.0, 334.0, 334.0, 0.04302946562184749, 0.011513743730845911, 0.0245402421124599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 188.1666666666667, 109, 342, 114.5, 341.1, 342.0, 342.0, 0.06070386127144237, 0.023840888223956778, 0.03419532289395541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 138.44444444444446, 111, 330, 116.0, 330.0, 330.0, 330.0, 0.043074154550066523, 0.0320111636841803, 0.02162120648313886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dabb7751-975e-4073-8b98-e8610e3efbea", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.7341056034482759, 1.3716774425287357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 143.77777777777777, 115, 340, 117.0, 340.0, 340.0, 340.0, 0.04220378802444068, 0.03321899721454999, 0.015002127774312899], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 408.0, 112, 657, 436.5, 627.6, 657.0, 657.0, 0.08455810463008472, 0.01665460227302755, 0.05754017996342862], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1274.3478260869567, 932, 2848, 1213.0, 1732.0000000000005, 2648.399999999997, 2848.0, 0.09816223229452084, 0.05080662413681254, 0.04515079239328058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 303.1111111111111, 225, 665, 232.0, 665.0, 665.0, 665.0, 0.04300540912479214, 0.06664998464945812, 0.09672017306093388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51aa739c-4584-4dee-8e46-539cef5e53f7", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["addBook", 56, 11, 19.642857142857142, 1062.071428571429, 575, 2316, 926.5, 1718.0000000000002, 2022.7999999999997, 2316.0, 0.2667085780146404, 92.24127147063585, 0.9666092990207984], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 194.8571428571429, 112, 601, 115.0, 457.90000000000003, 464.6, 601.0, 0.25142210628869543, 0.1868478739118137, 0.1215370533329143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91fb3c21-ef50-493c-b964-5e2a9ad5f1cc", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 656.9464285714283, 538, 902, 566.5, 797.3, 886.9499999999999, 902.0, 0.2511008080065286, 73.83197488543526, 0.12628605090172093], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 180.82142857142858, 110, 448, 116.0, 341.3, 344.2, 448.0, 0.25187217487125285, 0.4456956844401466, 0.12249252254480851], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 856.5714285714284, 751, 1134, 791.0, 1011.9, 1036.7499999999998, 1134.0, 0.25084548366144815, 225.71120713789782, 0.12591267441600035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 119.86666666666666, 115, 136, 118.0, 130.0, 136.0, 136.0, 0.124580578718315, 0.09307045187452244, 0.04428450259127604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, 6.5476190476190474, 167.7559523809524, 112, 941, 119.0, 273.2, 354.0999999999996, 899.6000000000001, 0.6846077360674175, 1.5497750319891115, 0.3264931669118486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 141.63636363636365, 115, 327, 122.0, 288.8000000000001, 327.0, 327.0, 0.05058983144387978, 0.03917747688964518, 0.01798310414606664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a15f5012-4d6e-44b8-ab88-8c9734cc95e4", 3, 0, 0.0, 284.0, 198, 444, 210.0, 444.0, 444.0, 444.0, 0.027709274294106235, 0.027790453808639752, 0.017769293736780368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53176531-1b7e-4c57-96a7-16db0e1ae85a", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 143.9444444444444, 112, 347, 119.0, 346.1, 347.0, 347.0, 0.100999899000101, 0.08196378522371478, 0.035902307847692154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18701fb3-d2e6-4a82-83f0-387c76dad758", 3, 0, 0.0, 449.3333333333333, 329, 657, 362.0, 657.0, 657.0, 657.0, 0.018325198981118937, 0.0252627661735152, 0.011751511065365984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 373.27272727272725, 226, 898, 236.0, 856.0000000000001, 898.0, 898.0, 0.051451878461308186, 5.668339802822369, 0.1145197127932757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c1a089b-a248-4d54-a092-205443d4ebf9", 3, 0, 0.0, 481.6666666666667, 191, 867, 387.0, 867.0, 867.0, 867.0, 0.04142444870962842, 0.026631929102056032, 0.02656450649673437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 416.75, 226, 1140, 342.5, 997.5000000000005, 1140.0, 1140.0, 0.06059779727006923, 6.127424582569549, 0.13499382344326785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=350805b5-4619-4273-b111-67b0a2b6212c", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23f9a11d-244e-425a-bfcb-8aab54171481", 3, 0, 0.0, 306.6666666666667, 217, 479, 224.0, 479.0, 479.0, 479.0, 0.03333259260905313, 0.0272888901079976, 0.021375393046821182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 136.58333333333331, 114, 339, 118.0, 274.80000000000024, 339.0, 339.0, 0.06970300710389814, 0.05779087210079055, 0.024777240806463794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 126.75, 113, 256, 118.0, 146.00000000000006, 250.5999999999999, 256.0, 0.10001200144017282, 0.07764603627435292, 0.035551141136936436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7652c03a-eaab-4bf5-baff-3c4cbfc7b08d", 3, 0, 0.0, 678.0, 213, 1215, 606.0, 1215.0, 1215.0, 1215.0, 0.07924139570511635, 0.035854667978551996, 0.050815608573919015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 128.4, 111, 330, 114.0, 201.60000000000008, 330.0, 330.0, 0.11966493817311528, 0.08893068159154369, 0.06006618966892701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 202.66666666666666, 110, 347, 114.0, 345.2, 347.0, 347.0, 0.11966207430217067, 0.044000741904860675, 0.06757479378235862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 284.6, 112, 1019, 324.0, 682.4000000000002, 1019.0, 1019.0, 0.11966398353423587, 7.208360486254597, 0.06966375916426674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 247.0666666666667, 112, 787, 116.0, 520.6000000000001, 787.0, 787.0, 0.11987245570712761, 2.379920889173919, 0.06990218657348582], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 23.333333333333332, 0.5359877488514548], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22970903522205208], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.22970903522205208], "isController": false}, {"data": ["401/Unauthorized", 17, 56.666666666666664, 1.3016845329249618], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 30, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

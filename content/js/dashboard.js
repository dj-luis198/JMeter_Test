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

    var data = {"OkPercent": 99.19472913616399, "KoPercent": 0.8052708638360175};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7923514538558787, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6759fdd3-6926-444c-a2f0-adc9d52a0f9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed7c9a13-7d1f-405d-adf6-d9e0dae7c25e"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77b8f8e6-8efb-48ab-bfcd-718e05fcc140"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06677d77-e9c7-48ba-b556-012accb2c670"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b956248-0112-4ee4-8dec-49096395c4bc"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50d02f50-e43c-490d-955d-00166e46a8e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5016f546-cd1f-4525-9c1f-e0ca4a2dc8ae"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a142f25-b050-42f4-bd46-aff6219c0804"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a7ac47c-ba96-4d82-8785-27aa28eed64b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ade38e4b-3bfe-4400-957c-74a9d0956680"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c00ebe71-66f3-45f5-8055-b065ad2a942f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2658565d-786a-4e70-8e73-32ce185cf0af"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06677d77-e9c7-48ba-b556-012accb2c670"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77b8f8e6-8efb-48ab-bfcd-718e05fcc140"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9aeedc72-678f-46e2-ac56-0d2174816b9d"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c00ebe71-66f3-45f5-8055-b065ad2a942f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/b4bfcedb-6a5a-4d94-bcfd-665d802f4968"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4b956248-0112-4ee4-8dec-49096395c4bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50d02f50-e43c-490d-955d-00166e46a8e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed7c9a13-7d1f-405d-adf6-d9e0dae7c25e"], "isController": false}, {"data": [0.3225806451612903, 500, 1500, "addBook"], "isController": true}, {"data": [0.9916666666666667, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8cb0b667-6f4b-4983-bc38-b5a55daf1120"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.970108695652174, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5016f546-cd1f-4525-9c1f-e0ca4a2dc8ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2658565d-786a-4e70-8e73-32ce185cf0af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7cc5dba2-990e-4d18-9985-c47f35530abf"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ade38e4b-3bfe-4400-957c-74a9d0956680"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67d7e3ec-a580-4c45-9439-482f951a4936"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6759fdd3-6926-444c-a2f0-adc9d52a0f9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dea632c1-a415-426f-8aec-0e3f45de2dd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9aeedc72-678f-46e2-ac56-0d2174816b9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a4d8bb3-a036-4231-9227-1a777babef8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1366, 11, 0.8052708638360175, 356.89092240117134, 97, 2160, 113.0, 1009.3, 1200.0, 1720.9799999999996, 5.347698258278949, 752.8670918000329, 3.9041052380332526], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1679.2166666666672, 1243, 2172, 1650.0, 2018.0, 2145.7, 2172.0, 0.25696481723377373, 309.2149950681492, 1.263493998800831], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6759fdd3-6926-444c-a2f0-adc9d52a0f9c", 3, 0, 0.0, 473.66666666666663, 281, 796, 344.0, 796.0, 796.0, 796.0, 0.031584266823886126, 0.026330503690095177, 0.02025423360776552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed7c9a13-7d1f-405d-adf6-d9e0dae7c25e", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 714.5000000000001, 115, 1182, 645.5, 1178.4, 1182.0, 1182.0, 0.0827934510380229, 0.01574611776333492, 0.0559435240859948], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 714.5000000000001, 115, 1182, 645.5, 1178.4, 1182.0, 1182.0, 0.08083094208463, 0.015372876924786808, 0.05461745704172224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77b8f8e6-8efb-48ab-bfcd-718e05fcc140", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06677d77-e9c7-48ba-b556-012accb2c670", 3, 0, 0.0, 304.6666666666667, 201, 469, 244.0, 469.0, 469.0, 469.0, 0.028558373315055976, 0.028642040424377426, 0.018313800595918056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 173.3684210526316, 99, 410, 103.0, 334.0, 410.0, 410.0, 0.10817273477753424, 0.0374957300236272, 0.06121411440690028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 112.26315789473684, 99, 298, 103.0, 105.0, 298.0, 298.0, 0.10817211892101158, 0.0803896313465721, 0.05429733313027339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 151.36842105263153, 98, 843, 101.0, 301.0, 843.0, 843.0, 0.10817335064106944, 1.7016508712224727, 0.0632104658428412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 194.78947368421055, 99, 1064, 103.0, 305.0, 1064.0, 1064.0, 0.10817088722900346, 5.150376436466684, 0.06310339073032428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b956248-0112-4ee4-8dec-49096395c4bc", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 257.07142857142856, 101, 884, 201.5, 593.5, 884.0, 884.0, 0.06851292692117587, 0.15089953038058931, 0.044287757657543024], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 123.8888888888889, 99, 306, 102.0, 294.3, 306.0, 306.0, 0.10237335562797521, 0.07608019886024331, 0.0513866257741985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 124.05555555555556, 98, 305, 102.0, 298.7, 305.0, 305.0, 0.10237393787039459, 0.03593529611661529, 0.05790748026457976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 771.0, 604, 927, 782.0, 927.0, 927.0, 927.0, 0.06163328197226502, 18.122231317411405, 0.0351502311248074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1229.0, 1159, 1305, 1223.0, 1305.0, 1305.0, 1305.0, 0.061159585745739216, 55.03150276110046, 0.03482035008766207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 168.66666666666666, 102, 301, 103.0, 301.0, 301.0, 301.0, 0.06250651109490572, 0.11060722471090739, 0.0346105388582144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 115.76923076923077, 99, 295, 100.0, 218.59999999999994, 295.0, 295.0, 0.08174866686789414, 0.06075267137350337, 0.04103399879892343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 161.92307692307693, 98, 310, 101.0, 307.2, 310.0, 310.0, 0.08174969501075323, 0.05020924777703714, 0.04503848131076203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 344.0, 97, 1167, 102.0, 1142.2, 1167.0, 1167.0, 0.08164290648747095, 16.969795804418137, 0.04637797918105885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 284.7692307692308, 99, 787, 104.0, 716.1999999999999, 787.0, 787.0, 0.08159012884964194, 5.553117821637702, 0.04642767623467831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50d02f50-e43c-490d-955d-00166e46a8e4", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 171.0, 102, 308, 103.0, 308.0, 308.0, 308.0, 0.06250651109490572, 0.04645259271799146, 0.03509887097614335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 637.3157894736842, 99, 1198, 979.0, 1169.0, 1198.0, 1198.0, 0.0931500402015963, 44.12587688199851, 0.0505488345214049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 188.94444444444449, 99, 1072, 101.5, 380.8000000000011, 1072.0, 1072.0, 0.10237510237510238, 5.143687943980912, 0.0596965928997179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 459.2631578947368, 99, 818, 584.0, 810.0, 818.0, 818.0, 0.09315871793991753, 14.428607632640853, 0.05064451889651047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 152.72222222222223, 98, 604, 102.5, 335.8000000000004, 604.0, 604.0, 0.10237452011943694, 1.6983661844163231, 0.05979622849424144], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 488.33333333333337, 112, 761, 492.5, 734.3000000000001, 761.0, 761.0, 0.08078414476518742, 0.015363976750996336, 0.05521696223004631], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5016f546-cd1f-4525-9c1f-e0ca4a2dc8ae", 3, 0, 0.0, 831.6666666666666, 215, 1430, 850.0, 1430.0, 1430.0, 1430.0, 0.022142509189141315, 0.02617169624536853, 0.014199460645380335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 500.38461538461536, 202, 1266, 206.0, 1241.6, 1266.0, 1266.0, 0.08153690799500743, 22.60793301194202, 0.1785641134899678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 518.5454545454545, 122, 1370, 503.5, 882.8, 1299.349999999999, 1370.0, 0.10248956469886703, 0.06295501581600328, 0.046340496538647885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 116.73684210526316, 100, 299, 104.0, 137.0, 299.0, 299.0, 0.09326343484321926, 0.06931003312079088, 0.046813872567787795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 144.52631578947364, 98, 311, 102.0, 308.0, 311.0, 311.0, 0.09326572386473525, 0.09868257563113897, 0.04906804839018452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a142f25-b050-42f4-bd46-aff6219c0804", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["login", 22, 0, 0.0, 2400.9090909090905, 1575, 4475, 2201.0, 3384.7, 4313.749999999998, 4475.0, 0.10250054744610568, 16.866049219772822, 0.1778289859900388], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 128.16666666666666, 100, 298, 105.5, 296.2, 298.0, 298.0, 0.09820878095622616, 0.07950691348897607, 0.03491015260553352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a7ac47c-ba96-4d82-8785-27aa28eed64b", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ade38e4b-3bfe-4400-957c-74a9d0956680", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 755.421052631579, 204, 1301, 1084.0, 1270.0, 1301.0, 1301.0, 0.09310211341797459, 58.69071382217251, 0.1968514411839649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c00ebe71-66f3-45f5-8055-b065ad2a942f", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2658565d-786a-4e70-8e73-32ce185cf0af", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 368.00000000000006, 201, 1163, 401.0, 604.0, 1163.0, 1163.0, 0.10810872323597859, 6.965866893268241, 0.24168322970543218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 880.4, 101, 1613, 1262.0, 1613.0, 1613.0, 1613.0, 0.10172112137364202, 73.02718242665907, 0.16458159559750984], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1195.3181818181818, 168, 2140, 1077.0, 2084.5, 2138.2, 2140.0, 0.10412525321368396, 0.033260179426743156, 0.04697838572726756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06677d77-e9c7-48ba-b556-012accb2c670", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77b8f8e6-8efb-48ab-bfcd-718e05fcc140", 3, 0, 0.0, 293.3333333333333, 198, 472, 210.0, 472.0, 472.0, 472.0, 0.025568036545246902, 0.030669991754308214, 0.016396169268924607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 120.625, 101, 314, 106.5, 181.70000000000013, 314.0, 314.0, 0.07494847292486416, 0.058187535132096686, 0.026641839985010306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 326.7777777777778, 202, 1175, 207.0, 667.4000000000008, 1175.0, 1175.0, 0.10231283855602481, 6.949851566452188, 0.22864965526257452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9aeedc72-678f-46e2-ac56-0d2174816b9d", 3, 0, 0.0, 312.0, 201, 531, 204.0, 531.0, 531.0, 531.0, 0.02110372480742851, 0.024943888273363583, 0.013533313108930392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 377.3125, 203, 1216, 307.0, 798.8000000000004, 1216.0, 1216.0, 0.08400096601110912, 6.402945948331531, 0.1875768641651879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 118.91666666666666, 99, 307, 102.5, 246.10000000000022, 307.0, 307.0, 0.05692086576636831, 0.04230154184395145, 0.028571606449134094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 117.33333333333333, 97, 305, 101.0, 244.4000000000002, 305.0, 305.0, 0.056921945781846645, 0.015231067523658184, 0.03246329720370941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 135.08333333333334, 98, 302, 102.5, 300.8, 302.0, 302.0, 0.05692113576639566, 0.01534202487453633, 0.033463402081416196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 149.08333333333331, 98, 304, 100.5, 301.3, 304.0, 304.0, 0.056922485804955104, 0.015342388752116807, 0.033519784121472586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 2.6332310267857144, 5.519321986607142], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 1153.2333333333331, 787, 1733, 1086.5, 1603.2, 1724.7, 1733.0, 0.2702069785455659, 323.2614854853818, 0.5335532330264983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1195.3181818181818, 168, 2140, 1077.0, 2084.5, 2138.2, 2140.0, 0.10270774976657329, 0.032807393790849675, 0.04633884803921569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c00ebe71-66f3-45f5-8055-b065ad2a942f", 3, 0, 0.0, 405.66666666666663, 193, 814, 210.0, 814.0, 814.0, 814.0, 0.03895850918771509, 0.025046567593013443, 0.024983158561132396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 101.77777777777777, 99, 104, 102.0, 104.0, 104.0, 104.0, 0.04503963487869325, 0.01213958908839779, 0.026522363117042997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 145.66666666666666, 99, 305, 102.0, 305.0, 305.0, 305.0, 0.04504008567625186, 0.01213971059242726, 0.026478644118265254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4bfcedb-6a5a-4d94-bcfd-665d802f4968", 2, 0, 0.0, 366.5, 207, 526, 366.5, 526.0, 526.0, 526.0, 0.022137607367395732, 0.03155257612569733, 0.013760338954440805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 208.0, 98, 1176, 103.5, 567.7000000000006, 1176.0, 1176.0, 0.07475936828333801, 4.223178799002429, 0.04354879216895617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 159.68749999999997, 99, 606, 103.0, 396.7000000000002, 606.0, 606.0, 0.07475971759516678, 1.3927556519514621, 0.04362200318663296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 115.68749999999999, 100, 307, 103.5, 165.60000000000014, 307.0, 307.0, 0.07475866966947323, 0.05555795665866126, 0.037525347861434806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 170.33333333333334, 100, 307, 105.0, 307.0, 307.0, 307.0, 0.044993700881876535, 0.012039330118783371, 0.025660470034195214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 138.6875, 98, 302, 102.0, 299.2, 302.0, 302.0, 0.07476006691025988, 0.027022040786289003, 0.04224418331635657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 107.77777777777777, 102, 147, 103.0, 147.0, 147.0, 147.0, 0.04503940948329788, 0.033471670524208685, 0.02260767233829601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 128.33333333333334, 101, 306, 106.0, 306.0, 306.0, 306.0, 0.04459949652123927, 0.035104681832147315, 0.015853727279034273], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 600.5, 101, 928, 524.0, 904.6000000000001, 928.0, 928.0, 0.08158825129181398, 0.015330995461653521, 0.05552755090766929], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1399.318181818182, 824, 2064, 1398.0, 1815.7, 2029.0499999999995, 2064.0, 0.10159410384764579, 0.05258288578051979, 0.04672931925023551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 279.0, 203, 452, 210.0, 452.0, 452.0, 452.0, 0.04497031958907122, 0.06969521209751564, 0.10113930274768652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b956248-0112-4ee4-8dec-49096395c4bc", 3, 0, 0.0, 720.0, 348, 928, 884.0, 928.0, 928.0, 928.0, 0.021533624755055016, 0.025452015457553635, 0.013808997645657026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50d02f50-e43c-490d-955d-00166e46a8e4", 3, 0, 0.0, 336.0, 235, 486, 287.0, 486.0, 486.0, 486.0, 0.07360518180479907, 0.03330442796506207, 0.047201239633936895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed7c9a13-7d1f-405d-adf6-d9e0dae7c25e", 3, 0, 0.0, 263.6666666666667, 190, 399, 202.0, 399.0, 399.0, 399.0, 0.04256466281692939, 0.027364976908670423, 0.027295698486116828], "isController": false}, {"data": ["addBook", 62, 4, 6.451612903225806, 1073.3064516129032, 532, 2614, 852.5, 1729.0, 1906.6499999999994, 2614.0, 0.2724580107049631, 90.4152861234828, 0.9902523477531003], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 175.1333333333333, 98, 543, 104.0, 409.0, 416.9, 543.0, 0.2712747199088517, 0.20160162290101186, 0.13113377573718904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8cb0b667-6f4b-4983-bc38-b5a55daf1120", 2, 0, 0.0, 391.0, 303, 479, 391.0, 479.0, 479.0, 479.0, 0.02253825869413329, 0.03209060661723275, 0.014009376619937343], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 633.866666666667, 489, 986, 602.5, 820.8, 912.6999999999999, 986.0, 0.2708522365623434, 79.63955068999607, 0.13621963069297546], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 150.00000000000003, 98, 428, 105.5, 304.9, 314.65, 428.0, 0.2714489947338895, 0.4803374789627029, 0.13201328064206735], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 976.7, 684, 1406, 969.5, 1233.0, 1315.0, 1406.0, 0.2707569009165121, 243.62753538454248, 0.1359072725303586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 122.75, 103, 303, 110.0, 176.30000000000013, 303.0, 303.0, 0.0824003213612533, 0.06155883382945193, 0.02929073923388301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 4, 2.1739130434782608, 173.30978260869568, 99, 2160, 107.0, 298.5, 347.5, 1094.1000000000072, 0.7760667754847255, 1.674893264457407, 0.3732053455816916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 123.08333333333334, 101, 310, 106.0, 250.9000000000002, 310.0, 310.0, 0.05529011182425117, 0.042817440113897626, 0.01965390693752678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5016f546-cd1f-4525-9c1f-e0ca4a2dc8ae", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 106.8421052631579, 101, 123, 106.0, 117.0, 123.0, 123.0, 0.10775800953941958, 0.08744815031958757, 0.038304604953465556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2658565d-786a-4e70-8e73-32ce185cf0af", 3, 0, 0.0, 296.3333333333333, 183, 517, 189.0, 517.0, 517.0, 517.0, 0.030303030303030304, 0.02526238952020202, 0.019432607323232324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cc5dba2-990e-4d18-9985-c47f35530abf", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 288.5833333333333, 202, 613, 207.5, 551.2000000000003, 613.0, 613.0, 0.05689279974208598, 0.08817272772528363, 0.12795324004494532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 362.43749999999994, 205, 1483, 213.0, 733.3000000000008, 1483.0, 1483.0, 0.07472235973212035, 5.6956872428500045, 0.16685743732662078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ade38e4b-3bfe-4400-957c-74a9d0956680", 3, 0, 0.0, 416.33333333333337, 189, 843, 217.0, 843.0, 843.0, 843.0, 0.02006447384261427, 0.023715528815928515, 0.01286686636391605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67d7e3ec-a580-4c45-9439-482f951a4936", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 107.0, 100, 119, 105.0, 117.0, 119.0, 119.0, 0.08102465019165446, 0.06717766407491664, 0.028801731122814672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6759fdd3-6926-444c-a2f0-adc9d52a0f9c", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.23740349868593955, 0.9059830814717477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dea632c1-a415-426f-8aec-0e3f45de2dd7", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.7807724633251835, 1.4588745415647923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 127.3157894736842, 102, 307, 106.0, 297.0, 307.0, 307.0, 0.09082825810522692, 0.0705160792906791, 0.03228660737334238], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9aeedc72-678f-46e2-ac56-0d2174816b9d", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 116.125, 99, 313, 103.0, 169.50000000000014, 313.0, 313.0, 0.08404685612228817, 0.06246060303619268, 0.04218758207700793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a4d8bb3-a036-4231-9227-1a777babef8c", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 152.87500000000003, 97, 325, 101.0, 315.90000000000003, 325.0, 325.0, 0.08404773911581778, 0.030379071718986385, 0.04749230766200202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 259.5, 101, 1113, 199.5, 624.4000000000005, 1113.0, 1113.0, 0.08404641463248079, 4.747806790753319, 0.048958678054955844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 194.625, 98, 797, 102.0, 453.30000000000035, 797.0, 797.0, 0.08404553166678048, 1.5657481464020635, 0.04904023942470834], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 27.272727272727273, 0.21961932650073207], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 9.090909090909092, 0.07320644216691069], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 9.090909090909092, 0.07320644216691069], "isController": false}, {"data": ["401/Unauthorized", 6, 54.54545454545455, 0.43923865300146414], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1366, 11, "401/Unauthorized", 6, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

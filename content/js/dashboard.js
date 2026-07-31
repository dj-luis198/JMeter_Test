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

    var data = {"OkPercent": 98.12874251497006, "KoPercent": 1.8712574850299402};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8119354838709677, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.40350877192982454, 500, 1500, "see books"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db1596a6-cf1b-4bc6-a975-4778006a3a7e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/150f2db9-396b-4ef0-b954-51dc248ffe51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f6478dad-d07d-437e-a0b1-670737f25407"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/53dfaa92-6321-4291-8066-687a080edcdc"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d1e6cae-2e8f-4903-9e17-a607f1b278e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c2e897b-c8ab-4d71-a8dc-95d17e10144e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ca279d0-2ef2-4c2a-b2e3-94363794a5a3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53dfaa92-6321-4291-8066-687a080edcdc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d1e6cae-2e8f-4903-9e17-a607f1b278e6"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=150f2db9-396b-4ef0-b954-51dc248ffe51"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2ff7c84-5602-48d2-8d7f-d552a90f053c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2dbaf129-f038-48d7-9146-68460853a0a9"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf3e23e9-d1a0-49ab-b510-ffdb354d1f0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50b2baa0-50b0-4c93-95a7-974e240b630a"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6eeb2f8f-2ae2-4e7c-8339-0d23ece993e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91adc659-c0cd-49f4-934b-a4cb63df2706"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0d8f871-a525-4d88-a228-93322c3a8097"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6478dad-d07d-437e-a0b1-670737f25407"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50b2baa0-50b0-4c93-95a7-974e240b630a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21052631578947367, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.36507936507936506, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9234972677595629, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ca279d0-2ef2-4c2a-b2e3-94363794a5a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6eeb2f8f-2ae2-4e7c-8339-0d23ece993e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0d8f871-a525-4d88-a228-93322c3a8097"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a509980-03fa-46e2-8341-3f1c750a3338"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db1596a6-cf1b-4bc6-a975-4778006a3a7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2dbaf129-f038-48d7-9146-68460853a0a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2ff7c84-5602-48d2-8d7f-d552a90f053c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 25, 1.8712574850299402, 302.31811377245515, 77, 3439, 95.0, 847.3, 1013.2999999999997, 1786.499999999994, 5.177351412727139, 698.7947530815607, 3.7919108183296064], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1332.3157894736846, 1053, 1796, 1283.0, 1629.6, 1675.0999999999997, 1796.0, 0.24407476395401118, 293.70574137709553, 1.2001137075277797], "isController": true}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 576.8571428571428, 86, 1362, 541.5, 1092.5, 1362.0, 1362.0, 0.08013325014738794, 0.016439166342317797, 0.05364388962503363], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 576.8571428571428, 86, 1362, 541.5, 1092.5, 1362.0, 1362.0, 0.08090708399311133, 0.016597916714825644, 0.05416191999734162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 92.8125, 79, 236, 81.5, 144.3000000000001, 236.0, 236.0, 0.0880635378425534, 0.03183058295310066, 0.049761488851706503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 83.625, 79, 95, 82.5, 90.80000000000001, 95.0, 95.0, 0.0880635378425534, 0.06544565654119447, 0.04420376801862543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 134.0625, 78, 627, 80.5, 355.40000000000026, 627.0, 627.0, 0.08806208376905719, 1.6405755510760085, 0.05138388188673015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 163.37500000000003, 78, 925, 83.0, 446.2000000000005, 925.0, 925.0, 0.08806402254438976, 4.9747626485392376, 0.05129901313254736], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 254.06666666666666, 79, 539, 206.0, 476.6, 539.0, 539.0, 0.08346177172649022, 0.17020007003833676, 0.05394043020370236], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/db1596a6-cf1b-4bc6-a975-4778006a3a7e", 3, 0, 0.0, 573.3333333333334, 206, 1077, 437.0, 1077.0, 1077.0, 1077.0, 0.016877447229848328, 0.023266923508596247, 0.010823102552995184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/150f2db9-396b-4ef0-b954-51dc248ffe51", 3, 0, 0.0, 493.33333333333337, 188, 877, 415.0, 877.0, 877.0, 877.0, 0.05051950895037301, 0.03247917648990452, 0.03239695072663894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 89.76190476190476, 79, 238, 81.0, 92.6, 223.4999999999998, 238.0, 0.1293453891448422, 0.09612484486252433, 0.06492532228559462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 111.28571428571429, 78, 246, 81.0, 241.0, 245.7, 246.0, 0.1293493726555426, 0.0438623337706574, 0.07325226284408473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 492.5, 463, 546, 480.5, 546.0, 546.0, 546.0, 0.050128454163794724, 14.739429945485305, 0.028588884015289178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 875.75, 848, 939, 858.0, 939.0, 939.0, 939.0, 0.04993196769401691, 44.928872302113376, 0.028428063638292828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 199.25, 81, 243, 236.5, 243.0, 243.0, 243.0, 0.05032269427705159, 0.08904758010743896, 0.027864226225672126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6478dad-d07d-437e-a0b1-670737f25407", 3, 0, 0.0, 1034.0, 435, 1864, 803.0, 1864.0, 1864.0, 1864.0, 0.04771827132609076, 0.03067825060840796, 0.030600584151171485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 22, 0, 0.0, 83.04545454545455, 79, 94, 82.0, 88.0, 93.1, 94.0, 0.11726391309678004, 0.08714632604165001, 0.05886098762865717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 22, 0, 0.0, 108.9090909090909, 77, 243, 81.0, 235.4, 241.95, 243.0, 0.11726391309678004, 0.03938293530230104, 0.06642942378112159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 22, 0, 0.0, 145.40909090909088, 77, 1036, 81.5, 238.4, 916.4499999999983, 1036.0, 0.11726641330014338, 4.826375956454184, 0.06848175307957592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 22, 0, 0.0, 135.95454545454547, 80, 481, 82.5, 251.5, 447.24999999999955, 481.0, 0.11726391309678004, 1.5974189113378214, 0.06859480854001099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 80.75, 79, 84, 80.0, 84.0, 84.0, 84.0, 0.05042037991756267, 0.0374706143723293, 0.028312225051365762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53dfaa92-6321-4291-8066-687a080edcdc", 3, 0, 0.0, 954.0, 324, 1977, 561.0, 1977.0, 1977.0, 1977.0, 0.021303186956768732, 0.02936816300843606, 0.013661223406521615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 561.4705882352941, 78, 1124, 754.0, 1038.3999999999999, 1124.0, 1124.0, 0.08081960588556894, 42.78639519301623, 0.0434275386864437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 152.5714285714286, 78, 883, 81.0, 311.6000000000001, 827.6999999999991, 883.0, 0.1293501693871266, 5.575561335463505, 0.07551441715429627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 391.05882352941177, 79, 719, 464.0, 715.0, 719.0, 719.0, 0.08081960588556894, 13.987585870831253, 0.043506464082816325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 120.9047619047619, 78, 471, 80.0, 240.20000000000002, 448.0999999999997, 471.0, 0.12934857593377355, 1.8442878937432245, 0.07563980386752242], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 497.91666666666674, 81, 955, 438.5, 913.6000000000001, 955.0, 955.0, 0.07575183698204681, 0.014406904543216423, 0.05177731761167083], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d1e6cae-2e8f-4903-9e17-a607f1b278e6", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c2e897b-c8ab-4d71-a8dc-95d17e10144e", 2, 0, 0.0, 276.5, 227, 326, 276.5, 326.0, 326.0, 326.0, 0.014662434110686715, 0.025057870794630618, 0.009113905577589936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ca279d0-2ef2-4c2a-b2e3-94363794a5a3", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.24782450274348422, 0.9457518861454047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 22, 0, 0.0, 266.8636363636364, 162, 1119, 168.0, 337.2, 1001.9999999999983, 1119.0, 0.1172120579240679, 6.547324659752044, 0.2622494925250674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53dfaa92-6321-4291-8066-687a080edcdc", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d1e6cae-2e8f-4903-9e17-a607f1b278e6", 3, 0, 0.0, 285.3333333333333, 173, 465, 218.0, 465.0, 465.0, 465.0, 0.08885992713485975, 0.04020680296792156, 0.05698374233583128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 716.1052631578948, 156, 2062, 544.0, 1362.0, 2062.0, 2062.0, 0.08617913467077302, 0.052936206746011946, 0.0389657610864921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 91.3529411764706, 79, 247, 81.0, 121.39999999999989, 247.0, 247.0, 0.08081806901863094, 0.06006108449529116, 0.040566882300367486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 183.88235294117646, 78, 261, 234.0, 249.79999999999998, 261.0, 261.0, 0.08075971135529048, 0.09296088557774072, 0.04206853530387029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=150f2db9-396b-4ef0-b954-51dc248ffe51", 1, 0, 0.0, 955.0, 955, 955, 955.0, 955.0, 955.0, 955.0, 1.0471204188481678, 0.18917702879581152, 0.721940445026178], "isController": false}, {"data": ["login", 19, 0, 0.0, 3058.4736842105262, 1803, 5128, 2949.0, 5015.0, 5128.0, 5128.0, 0.08430057146913711, 21.348833754281582, 0.15662072146869344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2ff7c84-5602-48d2-8d7f-d552a90f053c", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 113.9047619047619, 81, 309, 88.0, 243.0, 302.4999999999999, 309.0, 0.1299810599026999, 0.10522880728450996, 0.046204204887287846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2dbaf129-f038-48d7-9146-68460853a0a9", 3, 0, 0.0, 313.0, 207, 418, 314.0, 418.0, 418.0, 418.0, 0.022351696493763878, 0.030813618050485034, 0.014333607452055612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 683.1176470588236, 160, 1205, 837.0, 1119.3999999999999, 1205.0, 1205.0, 0.08072749721015268, 56.8621943410618, 0.1694080997578175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf3e23e9-d1a0-49ab-b510-ffdb354d1f0d", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50b2baa0-50b0-4c93-95a7-974e240b630a", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 278.625, 162, 1010, 182.0, 530.5000000000005, 1010.0, 1010.0, 0.08802332618143809, 6.709549026585795, 0.19655892405237388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 518.5, 79, 1023, 505.0, 1023.0, 1023.0, 1023.0, 0.06857240817725967, 41.02739414134487, 0.0997363578408263], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1198.409090909091, 354, 2275, 1120.5, 2107.7, 2258.95, 2275.0, 0.08852833711590774, 0.027853731067007902, 0.03994149584721619], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6eeb2f8f-2ae2-4e7c-8339-0d23ece993e3", 3, 0, 0.0, 325.0, 185, 476, 314.0, 476.0, 476.0, 476.0, 0.023900192794888545, 0.028249218762448017, 0.015326621030576313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91adc659-c0cd-49f4-934b-a4cb63df2706", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.0898837457337884, 2.0364494453924915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0d8f871-a525-4d88-a228-93322c3a8097", 3, 0, 0.0, 380.3333333333333, 189, 567, 385.0, 567.0, 567.0, 567.0, 0.05386093107596186, 0.03494298034973698, 0.03453972468087398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6478dad-d07d-437e-a0b1-670737f25407", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 86.14285714285714, 81, 105, 84.0, 100.0, 105.0, 105.0, 0.06683056066066784, 0.05188505441917082, 0.023756175859846764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 274.14285714285717, 159, 1121, 167.0, 396.20000000000005, 1050.099999999999, 1121.0, 0.12928089043752347, 7.555813946329962, 0.28918062271834616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50b2baa0-50b0-4c93-95a7-974e240b630a", 3, 0, 0.0, 331.0, 188, 440, 365.0, 440.0, 440.0, 440.0, 0.023656880603723594, 0.023726187871117313, 0.01517059075173681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 238.2, 158, 476, 168.0, 386.00000000000006, 476.0, 476.0, 0.0765091428425697, 0.11857422821402157, 0.17207085543597458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 96.81818181818181, 80, 235, 83.0, 205.4000000000001, 235.0, 235.0, 0.05366455748693756, 0.039881570554257305, 0.026937092332310453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 110.36363636363637, 79, 240, 81.0, 238.8, 240.0, 240.0, 0.05366586655738345, 0.021687413402806235, 0.030196578679039087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 175.36363636363635, 78, 800, 81.0, 687.2000000000004, 800.0, 800.0, 0.05366691385972444, 4.4031120482831465, 0.03113100276628547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 169.63636363636365, 79, 728, 81.0, 629.8000000000004, 728.0, 728.0, 0.05366665203030702, 1.4476750905014906, 0.03118325972464129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 3.6410108024691357, 7.631655092592593], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 900.9298245614035, 627, 1431, 869.0, 1283.4, 1327.8999999999999, 1431.0, 0.24591967486830354, 294.20542665445697, 0.4855952954919041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1198.409090909091, 354, 2275, 1120.5, 2107.7, 2258.95, 2275.0, 0.08543457071069913, 0.026880337233550933, 0.03854567545736621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 80.25, 79, 81, 80.5, 81.0, 81.0, 81.0, 0.08341501053114507, 0.022482952057222696, 0.04912036264675828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 118.75, 80, 233, 81.0, 233.0, 233.0, 233.0, 0.08341327105142428, 0.0224824832130792, 0.04903788005171623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 114.35714285714285, 78, 239, 81.5, 237.5, 239.0, 239.0, 0.06588514337077805, 0.017758105049155024, 0.038733258114461315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 137.21428571428572, 79, 245, 82.5, 243.5, 245.0, 245.0, 0.0658857634983458, 0.017758272192913514, 0.03879796424756105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 83.57142857142857, 80, 96, 81.0, 95.0, 96.0, 96.0, 0.065883593102929, 0.04896231870246969, 0.03307047544424366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 120.25, 79, 242, 80.0, 242.0, 242.0, 242.0, 0.08341675008341676, 0.02232049758091425, 0.04757361528194862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 113.42857142857143, 78, 234, 82.0, 233.5, 234.0, 234.0, 0.06588545343310273, 0.017629506094404442, 0.037575297661066404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 118.5, 80, 233, 80.5, 233.0, 233.0, 233.0, 0.08341327105142428, 0.06198974538099011, 0.04186955207073445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 130.5, 84, 253, 92.5, 253.0, 253.0, 253.0, 0.0891146459920688, 0.07014297331016352, 0.031677471817493204], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 508.25, 81, 877, 478.5, 854.8000000000001, 877.0, 877.0, 0.0769531675847607, 0.014460031246192422, 0.05237299320567658], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1698.7894736842104, 981, 3439, 1642.0, 2339.0, 3439.0, 3439.0, 0.08650755347532714, 0.044774417326097056, 0.03979009539734286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 240.75, 162, 475, 163.0, 475.0, 475.0, 475.0, 0.08327088017320343, 0.12905360042468147, 0.18727816117078858], "isController": false}, {"data": ["addBook", 63, 11, 17.46031746031746, 876.0158730158731, 412, 2010, 727.0, 1507.0, 1645.2, 2010.0, 0.2840499206463714, 76.5778763506461, 1.0356030720787945], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 125.56140350877202, 78, 351, 83.0, 319.8, 332.79999999999995, 351.0, 0.246583520433987, 0.18325201079127354, 0.11919808849103863], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 533.8245614035088, 383, 776, 489.0, 697.6, 725.5999999999999, 776.0, 0.246321384585467, 72.42666570784988, 0.12388233697413625], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 114.35087719298245, 77, 338, 83.0, 244.40000000000003, 317.29999999999995, 338.0, 0.24669878078865703, 0.4365412019424283, 0.1199765555007336], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 771.4561403508771, 543, 1052, 786.0, 965.8, 1007.0999999999998, 1052.0, 0.24632990056050855, 221.64807752612396, 0.12364606336728654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 119.53333333333333, 80, 274, 85.0, 253.0, 274.0, 274.0, 0.07423684523102506, 0.05546014316575602, 0.026388878578215938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 11, 6.0109289617486334, 154.7978142076502, 80, 778, 92.0, 328.39999999999986, 439.59999999999997, 637.7199999999995, 0.754969182405505, 1.5462501456822364, 0.36489049079185126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 101.18181818181817, 83, 181, 91.0, 166.60000000000005, 181.0, 181.0, 0.05393743257820928, 0.0417699062837109, 0.01917307173678533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ca279d0-2ef2-4c2a-b2e3-94363794a5a3", 3, 0, 0.0, 434.6666666666667, 272, 539, 493.0, 539.0, 539.0, 539.0, 0.017337432672969787, 0.02390105057618068, 0.011118080197184401], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6eeb2f8f-2ae2-4e7c-8339-0d23ece993e3", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 105.25, 80, 273, 90.0, 186.2000000000001, 273.0, 273.0, 0.09226102951776313, 0.07487198782154411, 0.03279591283639236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0d8f871-a525-4d88-a228-93322c3a8097", 1, 0, 0.0, 817.0, 817, 817, 817.0, 817.0, 817.0, 817.0, 1.2239902080783354, 0.2211310434516524, 0.8438838739290087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a509980-03fa-46e2-8341-3f1c750a3338", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 288.6363636363636, 163, 883, 166.0, 801.6000000000004, 883.0, 883.0, 0.05364335943976826, 5.909770421661189, 0.11939743115362483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 244.57142857142856, 162, 326, 248.5, 325.0, 326.0, 326.0, 0.06585848892401343, 0.10206779484610283, 0.14811728514844033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db1596a6-cf1b-4bc6-a975-4778006a3a7e", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2dbaf129-f038-48d7-9146-68460853a0a9", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 22, 0, 0.0, 107.09090909090908, 80, 330, 87.0, 215.5999999999999, 318.14999999999986, 330.0, 0.11357887020000207, 0.0941684187498064, 0.040373739016406986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 91.17647058823528, 83, 112, 86.0, 111.2, 112.0, 112.0, 0.07860980865447752, 0.06103007605498987, 0.027943330420146305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2ff7c84-5602-48d2-8d7f-d552a90f053c", 3, 0, 0.0, 426.6666666666667, 308, 491, 481.0, 491.0, 491.0, 491.0, 0.040068383374292124, 0.025760109753980125, 0.02569489428624853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 94.60000000000001, 78, 242, 85.0, 150.20000000000005, 242.0, 242.0, 0.07654076561176483, 0.05688234631889945, 0.03841987648871789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 111.13333333333334, 78, 241, 80.0, 237.4, 241.0, 241.0, 0.07654232790733276, 0.020481052584579273, 0.043653046384650715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 121.66666666666667, 78, 236, 81.0, 235.4, 236.0, 236.0, 0.07654115617967781, 0.020630233501553782, 0.0449978281446934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 120.8, 78, 236, 80.0, 234.8, 236.0, 236.0, 0.07654193732746171, 0.020630444045292417, 0.04507303535982365], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 24.0, 0.4491017964071856], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.0, 0.2245508982035928], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.0748502994011976], "isController": false}, {"data": ["401/Unauthorized", 15, 60.0, 1.122754491017964], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 25, "401/Unauthorized", 15, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

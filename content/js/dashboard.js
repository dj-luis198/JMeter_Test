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

    var data = {"OkPercent": 97.65074393108848, "KoPercent": 2.349256068911511};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7506738544474394, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14035087719298245, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/80ab9ab5-a0cb-4899-aa50-29c9842b91df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0473fcc9-22eb-4789-843c-ad32b4cada6d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80ffc047-9096-4c7a-99da-a22c14a5680f"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10fee6d3-08da-4624-91c2-bd405823afca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d45c44c3-f1e4-4ef4-a622-97f3224cfbf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=042f8a06-7625-4ff1-8ea6-9c4dbe47b4b8"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0ab2ac0-0834-4807-88e3-1091fd8ccf07"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c6d94d15-9632-48af-aab0-998a43572d53"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=961555fe-ead3-4a33-a850-127522ad4919"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45964234-f835-46fd-9934-08d56d0b97f1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ed4c993-6673-4c08-a4cb-5a4da8b6b4f9"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53633ed7-4953-4e6f-8165-6fa893dfb085"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80ffc047-9096-4c7a-99da-a22c14a5680f"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/53633ed7-4953-4e6f-8165-6fa893dfb085"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d45c44c3-f1e4-4ef4-a622-97f3224cfbf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c884cc7-39bd-40ec-8a30-3f81091f5fd5"], "isController": false}, {"data": [0.3018867924528302, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0473fcc9-22eb-4789-843c-ad32b4cada6d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/042f8a06-7625-4ff1-8ea6-9c4dbe47b4b8"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5087719298245614, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8926380368098159, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ed4c993-6673-4c08-a4cb-5a4da8b6b4f9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45964234-f835-46fd-9934-08d56d0b97f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01e5e754-12ff-42cb-81ff-307c487f55d8"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/961555fe-ead3-4a33-a850-127522ad4919"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6d94d15-9632-48af-aab0-998a43572d53"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/a09ba876-bd87-403a-9b18-d8f61e4fb437"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80ab9ab5-a0cb-4899-aa50-29c9842b91df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1277, 30, 2.349256068911511, 433.9937353171493, 98, 7009, 153.0, 920.6000000000006, 1225.5999999999995, 4129.240000000002, 5.025204726919278, 728.2482144499722, 3.680485323804989], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1834.40350877193, 1214, 4467, 1601.0, 2915.000000000001, 3693.099999999999, 4467.0, 0.24757958380568912, 297.92184323814547, 1.2173468793570748], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/80ab9ab5-a0cb-4899-aa50-29c9842b91df", 3, 0, 0.0, 440.3333333333333, 218, 563, 540.0, 563.0, 563.0, 563.0, 0.01804218262297251, 0.024872605276135606, 0.011570019455486929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0473fcc9-22eb-4789-843c-ad32b4cada6d", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80ffc047-9096-4c7a-99da-a22c14a5680f", 3, 0, 0.0, 417.0, 226, 565, 460.0, 565.0, 565.0, 565.0, 0.039291701592623636, 0.03275587492796521, 0.02519682686766555], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 742.4615384615385, 107, 2066, 566.0, 1711.5999999999997, 2066.0, 2066.0, 0.07588714997052076, 0.015711011517334377, 0.05074155062256651], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 742.4615384615385, 107, 2066, 566.0, 1711.5999999999997, 2066.0, 2066.0, 0.07656877643095263, 0.01585212949547066, 0.05119731663250521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 140.04545454545453, 102, 335, 111.5, 325.2, 334.25, 335.0, 0.10692172357818408, 0.028609914316818787, 0.060978795478183107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 110.63636363636363, 103, 114, 111.0, 114.0, 114.0, 114.0, 0.10692172357818408, 0.07946038246386532, 0.05366969328045568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 149.95454545454544, 105, 339, 111.0, 327.8, 337.5, 339.0, 0.10691912540155421, 0.02881804551838766, 0.06296116466517304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 180.2272727272727, 104, 341, 112.5, 338.7, 340.7, 341.0, 0.10691912540155421, 0.02881804551838766, 0.06285675145677308], "isController": false}, {"data": ["goToProfile", 13, 3, 23.076923076923077, 257.92307692307685, 106, 671, 218.0, 598.5999999999999, 671.0, 671.0, 0.0760598649644859, 0.12679691430978599, 0.04915437336910097], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/10fee6d3-08da-4624-91c2-bd405823afca", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 123.94117647058822, 105, 326, 112.0, 159.59999999999985, 326.0, 326.0, 0.12707145152971605, 0.09443493614659562, 0.063783912193627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 752.8571428571429, 508, 902, 757.0, 902.0, 902.0, 902.0, 0.03216527436979038, 9.457658652343929, 0.018344258039021073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 135.41176470588235, 99, 342, 112.0, 315.59999999999997, 342.0, 342.0, 0.12707620087009822, 0.04523001726741318, 0.07184535667299556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 861.1428571428572, 710, 1123, 877.0, 1123.0, 1123.0, 1123.0, 0.03216911764705883, 28.945828606100644, 0.01831503475413603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 204.42857142857142, 108, 331, 113.0, 331.0, 331.0, 331.0, 0.03222672884890729, 0.05702620378341797, 0.017844292243486746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 135.4, 111, 340, 113.5, 317.4000000000001, 340.0, 340.0, 0.05110749951447875, 0.03798125696339681, 0.025653569092228594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 132.8, 99, 331, 112.5, 309.20000000000005, 331.0, 331.0, 0.05110697712451703, 0.01367510911339616, 0.029146947891326123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 174.89999999999998, 105, 330, 114.0, 330.0, 330.0, 330.0, 0.051050361181305355, 0.01375966766214871, 0.030012028741353346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d45c44c3-f1e4-4ef4-a622-97f3224cfbf9", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 149.4, 100, 317, 110.0, 317.0, 317.0, 317.0, 0.051053749387355005, 0.013760580889560529, 0.03006387781306159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 141.0, 104, 339, 108.0, 339.0, 339.0, 339.0, 0.03225940246369665, 0.02397402858874331, 0.018114410563110913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 502.3684210526317, 101, 1020, 298.0, 1008.0, 1020.0, 1020.0, 0.09490035462764097, 40.46207049004795, 0.05192789758253833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 199.99999999999997, 104, 1014, 113.0, 472.3999999999995, 1014.0, 1014.0, 0.12707620087009822, 6.758317943253002, 0.07406451826907265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 415.36842105263156, 106, 775, 342.0, 769.0, 775.0, 775.0, 0.09489798466648353, 13.230747649401893, 0.052019274592313265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 213.41176470588232, 103, 533, 113.0, 381.79999999999984, 533.0, 533.0, 0.12708475057748805, 2.23030525102976, 0.07419360754360128], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 514.4615384615385, 107, 1288, 491.0, 1117.9999999999998, 1288.0, 1288.0, 0.07745841079174413, 0.016036311609228276, 0.05212965011142095], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=042f8a06-7625-4ff1-8ea6-9c4dbe47b4b8", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.3031276216442953, 1.1568005453020134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 312.79999999999995, 222, 671, 228.0, 648.2, 671.0, 671.0, 0.05102144941733505, 0.07907328147003, 0.11474843555480724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0ab2ac0-0834-4807-88e3-1091fd8ccf07", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 929.5454545454543, 121, 2341, 661.0, 2030.3999999999996, 2309.3499999999995, 2341.0, 0.10070493454179255, 0.061858792799597176, 0.045533578801611276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 114.42105263157895, 102, 173, 111.0, 117.0, 173.0, 173.0, 0.09489514086933938, 0.07052265839996803, 0.04763291250668012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 179.47368421052627, 102, 340, 113.0, 338.0, 340.0, 340.0, 0.0948994066289733, 0.09290932861167163, 0.0503470227808523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6d94d15-9632-48af-aab0-998a43572d53", 3, 0, 0.0, 736.3333333333334, 207, 1027, 975.0, 1027.0, 1027.0, 1027.0, 0.022650569661826995, 0.022716928752633127, 0.014525267654231504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=961555fe-ead3-4a33-a850-127522ad4919", 1, 0, 0.0, 768.0, 768, 768, 768.0, 768.0, 768.0, 768.0, 1.3020833333333333, 0.23523966471354166, 0.8977254231770833], "isController": false}, {"data": ["login", 22, 0, 0.0, 5483.136363636364, 1234, 12386, 4368.0, 10470.199999999999, 12129.049999999996, 12386.0, 0.09539543576201441, 36.44159424608337, 0.19426318408283794], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 284.64705882352933, 107, 1949, 116.0, 1324.9999999999995, 1949.0, 1949.0, 0.12282615763653572, 0.09943641082098448, 0.043660860722362305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45964234-f835-46fd-9934-08d56d0b97f1", 3, 0, 0.0, 369.33333333333337, 209, 674, 225.0, 674.0, 674.0, 674.0, 0.04194454930581771, 0.02745784135872377, 0.026898034548327114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ed4c993-6673-4c08-a4cb-5a4da8b6b4f9", 3, 0, 0.0, 368.3333333333333, 284, 527, 294.0, 527.0, 527.0, 527.0, 0.07238159577291481, 0.032043935628634154, 0.046416583226771536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 632.7368421052631, 209, 1131, 450.0, 1116.0, 1131.0, 1131.0, 0.09484445509364642, 53.82486199195819, 0.20181258205293318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53633ed7-4953-4e6f-8165-6fa893dfb085", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 304.72727272727275, 216, 452, 228.0, 450.7, 451.85, 452.0, 0.10686355467042309, 0.1656176379511342, 0.2403386390683441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 602.3846153846154, 106, 1231, 820.0, 1225.8, 1231.0, 1231.0, 0.05970587965131766, 38.46913694002774, 0.09075186064188413], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1704.1739130434785, 169, 4162, 1411.0, 3975.6000000000004, 4153.599999999999, 4162.0, 0.09464241626203605, 0.02952753374207884, 0.04269999639947329], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 405.7647058823529, 220, 1341, 430.0, 634.5999999999993, 1341.0, 1341.0, 0.12696326280648557, 9.120029061517435, 0.2836324866315153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 113.23076923076923, 106, 117, 114.0, 116.6, 117.0, 117.0, 0.11341924113803122, 0.08805497725071759, 0.040316995873284536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80ffc047-9096-4c7a-99da-a22c14a5680f", 1, 0, 0.0, 863.0, 863, 863, 863.0, 863.0, 863.0, 863.0, 1.1587485515643106, 0.20934422074159909, 0.7989028099652375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 458.7058823529411, 214, 1360, 420.0, 986.3999999999996, 1360.0, 1360.0, 0.08128215426396618, 17.264043808092833, 0.17913544625098016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 153.83333333333334, 109, 364, 113.0, 364.0, 364.0, 364.0, 0.04075173364666888, 0.030285223930776387, 0.020455460053113092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 183.33333333333331, 110, 326, 115.5, 326.0, 326.0, 326.0, 0.04069203589037566, 0.010888298665979422, 0.023207176718729863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53633ed7-4953-4e6f-8165-6fa893dfb085", 3, 0, 0.0, 1303.3333333333333, 671, 1620, 1619.0, 1620.0, 1620.0, 1620.0, 0.08220529402093495, 0.037195754781607936, 0.05271628555378966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 186.66666666666669, 108, 344, 113.0, 344.0, 344.0, 344.0, 0.04068706897136309, 0.010966436558687705, 0.02391954640699275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 110.66666666666667, 99, 116, 113.0, 116.0, 116.0, 116.0, 0.040754778497778865, 0.01098468639197946, 0.023999151791172513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 110.0, 107, 116, 107.0, 116.0, 116.0, 116.0, 0.05870037372571272, 0.01731202428238793, 0.036286461492554836], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1018.0175438596488, 797, 1489, 894.0, 1421.6, 1459.8999999999999, 1489.0, 0.2502711270543089, 299.41127627846834, 0.4941877137732544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1704.1739130434785, 169, 4162, 1411.0, 3975.6000000000004, 4153.599999999999, 4162.0, 0.09478204251180655, 0.029571095804040187, 0.04276299183638147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 167.66666666666669, 108, 453, 111.5, 453.0, 453.0, 453.0, 0.044125109393500374, 0.011893095891216897, 0.025983829066680394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 226.16666666666666, 111, 454, 113.5, 454.0, 454.0, 454.0, 0.04412446039461976, 0.011892920965737356, 0.025940356599180755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 122.53846153846155, 99, 308, 108.0, 230.79999999999993, 308.0, 308.0, 0.11044091411095064, 0.029767277631467165, 0.0649271780222581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 178.53846153846152, 104, 342, 111.0, 342.0, 342.0, 342.0, 0.11044279063445135, 0.029767783413191966, 0.06503613550056071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 146.33333333333334, 105, 330, 110.5, 330.0, 330.0, 330.0, 0.044124135902338574, 0.011806653551992941, 0.025164546256802475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 138.38461538461542, 101, 481, 111.0, 334.9999999999999, 481.0, 481.0, 0.11044935896891275, 0.08208199431185802, 0.05544040088869254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 187.16666666666669, 111, 340, 113.0, 340.0, 340.0, 340.0, 0.04405189313010727, 0.03273778385938635, 0.022111985418823372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 141.53846153846152, 100, 340, 111.0, 322.0, 340.0, 340.0, 0.11043997587311297, 0.029551321669172806, 0.06298529874013474], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 560.8461538461538, 106, 1620, 527.0, 1382.7999999999997, 1620.0, 1620.0, 0.07869678130164477, 0.01579610874684456, 0.05354833571441543], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 146.83333333333331, 113, 306, 115.5, 306.0, 306.0, 306.0, 0.04065398713978873, 0.03199913440885715, 0.014451221991096778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 3427.3181818181815, 848, 7009, 3285.0, 6657.3, 6961.599999999999, 7009.0, 0.09717829566938177, 0.050297360063254234, 0.04469821998074103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 413.6666666666667, 222, 795, 225.5, 795.0, 795.0, 795.0, 0.044016021831946826, 0.06821623696025353, 0.0989930647255601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d45c44c3-f1e4-4ef4-a622-97f3224cfbf9", 3, 0, 0.0, 413.3333333333333, 215, 533, 492.0, 533.0, 533.0, 533.0, 0.03022670025188917, 0.02519875629722922, 0.019383658690176324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c884cc7-39bd-40ec-8a30-3f81091f5fd5", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["addBook", 53, 10, 18.867924528301888, 1165.4150943396219, 545, 4842, 898.0, 1824.2, 2742.899999999999, 4842.0, 0.2719106081049883, 80.8620874926892, 0.9888473763832811], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0473fcc9-22eb-4789-843c-ad32b4cada6d", 3, 0, 0.0, 507.0, 244, 832, 445.0, 832.0, 832.0, 832.0, 0.02514184189133696, 0.025215499631252986, 0.016122860848285746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/042f8a06-7625-4ff1-8ea6-9c4dbe47b4b8", 3, 0, 0.0, 1378.3333333333333, 264, 3258, 613.0, 3258.0, 3258.0, 3258.0, 0.0477501711047798, 0.030698759092428415, 0.03062104071497923], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 201.26315789473685, 99, 616, 114.0, 452.2, 458.4, 616.0, 0.2510504479268518, 0.1865716707737639, 0.12135739426151529], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 637.2982456140351, 489, 902, 566.0, 789.4, 838.6999999999996, 902.0, 0.2511721366376423, 73.85294787131615, 0.12632192418787674], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 162.10526315789474, 98, 453, 112.0, 337.4, 376.2999999999995, 453.0, 0.25163563160543534, 0.4452771137393055, 0.12237748490186211], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 811.6315789473687, 684, 1037, 776.0, 1001.6, 1021.5999999999999, 1037.0, 0.2509719659910971, 225.82501616044814, 0.12597616261662492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 182.8823529411765, 107, 1044, 117.0, 478.3999999999995, 1044.0, 1044.0, 0.08216013493593927, 0.06137939768163431, 0.029205360465509658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 10, 6.134969325153374, 248.5276073619634, 101, 2239, 117.0, 454.5999999999999, 996.5999999999999, 1672.599999999987, 0.6684656457870259, 1.518016789560453, 0.31697170965215177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 152.83333333333334, 112, 343, 116.0, 343.0, 343.0, 343.0, 0.03899572996756855, 0.030198841664337756, 0.013861763386909134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 213.4545454545454, 109, 1075, 116.0, 511.6999999999999, 997.2999999999988, 1075.0, 0.10230987801872271, 0.08302686389995954, 0.03636796445196784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ed4c993-6673-4c08-a4cb-5a4da8b6b4f9", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45964234-f835-46fd-9934-08d56d0b97f1", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01e5e754-12ff-42cb-81ff-307c487f55d8", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 343.1666666666667, 224, 709, 230.5, 709.0, 709.0, 709.0, 0.04065646641098267, 0.06300958222092724, 0.09143734584423152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 334.61538461538464, 207, 790, 228.0, 655.1999999999998, 790.0, 790.0, 0.11034435928123382, 0.1710122052532403, 0.2481670502194155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/961555fe-ead3-4a33-a850-127522ad4919", 3, 0, 0.0, 1840.3333333333335, 490, 4463, 568.0, 4463.0, 4463.0, 4463.0, 0.01768993089133665, 0.024386997827086823, 0.011344128859353257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 147.00000000000003, 108, 431, 115.5, 400.60000000000014, 431.0, 431.0, 0.05298490460067927, 0.043929867193336615, 0.01883447780727271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6d94d15-9632-48af-aab0-998a43572d53", 1, 0, 0.0, 1288.0, 1288, 1288, 1288.0, 1288.0, 1288.0, 1288.0, 0.7763975155279502, 0.14026712927018634, 0.5352896933229814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 261.36842105263156, 107, 2342, 116.0, 424.0, 2342.0, 2342.0, 0.09349105438227016, 0.07258338694717263, 0.03323314823744759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a09ba876-bd87-403a-9b18-d8f61e4fb437", 1, 0, 0.0, 3278.0, 3278, 3278, 3278.0, 3278.0, 3278.0, 3278.0, 0.3050640634533252, 0.09741791870042708, 0.18202553004881025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80ab9ab5-a0cb-4899-aa50-29c9842b91df", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 136.29411764705884, 99, 342, 110.0, 336.4, 342.0, 342.0, 0.08141177597394823, 0.060502306168139265, 0.04086489536192323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 167.35294117647058, 102, 453, 112.0, 354.5999999999999, 453.0, 453.0, 0.08133387555917039, 0.04332075449130445, 0.04518029507451619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 304.23529411764713, 102, 1018, 115.0, 826.7999999999998, 1018.0, 1018.0, 0.08141567491199923, 12.945948185807332, 0.04662880738009147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 284.47058823529414, 98, 786, 114.0, 781.2, 786.0, 786.0, 0.08132687183363392, 4.237957867298465, 0.04665736839398564], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.6264682850430697], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.23492560689115113], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.23492560689115113], "isController": false}, {"data": ["401/Unauthorized", 16, 53.333333333333336, 1.2529365700861395], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1277, 30, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

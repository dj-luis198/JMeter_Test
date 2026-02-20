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

    var data = {"OkPercent": 69.30860033726813, "KoPercent": 30.69139966273187};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5244498777506112, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b23001e-1cb5-426c-b5ff-226a6fcfb201"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebd86bc2-6aa0-4b09-a4de-eb88cd0b2901"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33afd21d-4611-4fc2-9b09-3a54c831177c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2a47cf9-e84c-4c2d-904e-e8c08e796369"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=950db14f-271c-4a9a-b852-28f69aa052fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90c66f4e-1287-483f-b4e2-0babffc7f753"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21383fe8-4f96-4c23-8533-dcb4f18fa3eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9062ffa6-09de-4ed9-b467-dce4dbb5e454"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2a47cf9-e84c-4c2d-904e-e8c08e796369"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bacb78f8-b23b-4f2f-8f1f-827d162e2025"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bc1a8c6-210a-4998-b074-0f66f7c94e81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd585fb4-b80d-4dc9-b3ab-d4320a478a81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/950db14f-271c-4a9a-b852-28f69aa052fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64a290cb-fb14-424e-b2a0-b74a060daba5"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21383fe8-4f96-4c23-8533-dcb4f18fa3eb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c32b4567-a76c-4c5a-9d7d-b8e624a1689f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f1158c7-c98b-4ee5-a50e-4a9cae46abc3"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c32b4567-a76c-4c5a-9d7d-b8e624a1689f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.945859872611465, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5708ce39-b443-4b1d-9cbe-e76776f1215b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5155a248-062c-42d7-b3bc-d1e8b037948b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7f1158c7-c98b-4ee5-a50e-4a9cae46abc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f97c723a-cbbc-49f5-b789-386ee9f46c94"], "isController": false}, {"data": [0.82, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.08, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91700242-5786-499e-91a4-ce8ea8f1a36f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb8c2974-dec5-43fd-8396-25e7361f05ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f97c723a-cbbc-49f5-b789-386ee9f46c94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb8c2974-dec5-43fd-8396-25e7361f05ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5155a248-062c-42d7-b3bc-d1e8b037948b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9062ffa6-09de-4ed9-b467-dce4dbb5e454"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bacb78f8-b23b-4f2f-8f1f-827d162e2025"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90c66f4e-1287-483f-b4e2-0babffc7f753"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af06af1a-a8ef-4b4c-8afb-09fe90ca8d63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebd86bc2-6aa0-4b09-a4de-eb88cd0b2901"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=206503c1-8c16-477f-a2bb-b19644cc3b9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33afd21d-4611-4fc2-9b09-3a54c831177c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af06af1a-a8ef-4b4c-8afb-09fe90ca8d63"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/206503c1-8c16-477f-a2bb-b19644cc3b9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ee67837-1ae7-44d1-9b15-2e8bb7e092cc"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 593, 182, 30.69139966273187, 273.11298482293444, 81, 2598, 92.0, 754.0000000000003, 1084.8999999999994, 1497.0599999999972, 2.337176076460735, 2.443043957532762, 1.1289366563208199], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9b23001e-1cb5-426c-b5ff-226a6fcfb201", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["see books", 55, 55, 100.0, 489.29090909090894, 341, 676, 515.0, 629.2, 639.6, 676.0, 0.25411082003871727, 1.63448934264996, 0.42657861293608884], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, 100.0, 105.87500000000001, 83, 250, 84.0, 247.9, 250.0, 250.0, 0.07416265724800919, 0.03686405521409832, 0.037226177563942114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 98.8125, 85, 251, 89.0, 145.30000000000013, 251.0, 251.0, 0.08161100116295676, 0.06336010344194398, 0.02901016056964479], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebd86bc2-6aa0-4b09-a4de-eb88cd0b2901", 3, 0, 0.0, 274.3333333333333, 170, 377, 276.0, 377.0, 377.0, 377.0, 0.01999800019998, 0.023636959220744595, 0.012824238409492384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33afd21d-4611-4fc2-9b09-3a54c831177c", 1, 0, 0.0, 844.0, 844, 844, 844.0, 844.0, 844.0, 844.0, 1.1848341232227488, 0.2140569460900474, 0.8168875888625593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, 100.0, 121.21052631578945, 83, 257, 86.0, 252.0, 257.0, 257.0, 0.12602310865845084, 0.06264234600307762, 0.06325769321332396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2a47cf9-e84c-4c2d-904e-e8c08e796369", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 0.03938558487593541, 0.011615670539582512, 0.02434675315084679], "isController": false}, {"data": ["https://demoqa.com/books", 55, 55, 100.0, 163.94545454545457, 83, 409, 87.0, 344.8, 353.0, 409.0, 0.25184995237746355, 0.12518713453137592, 0.1217438734637153], "isController": false}, {"data": ["deleteBook", 17, 2, 11.764705882352942, 496.52941176470586, 85, 1147, 457.0, 810.1999999999997, 1147.0, 1147.0, 0.09965180487004231, 0.01934302898988241, 0.06717108676155081], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 2, 11.764705882352942, 496.52941176470586, 85, 1147, 457.0, 810.1999999999997, 1147.0, 1147.0, 0.09881652677346602, 0.019180896367620732, 0.06660806095817154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 4, 15.384615384615385, 967.2692307692307, 130, 1486, 984.5, 1456.7, 1485.3, 1486.0, 0.11085718183988812, 0.03534238880171914, 0.050015642587918276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=950db14f-271c-4a9a-b852-28f69aa052fe", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90c66f4e-1287-483f-b4e2-0babffc7f753", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21383fe8-4f96-4c23-8533-dcb4f18fa3eb", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9062ffa6-09de-4ed9-b467-dce4dbb5e454", 3, 0, 0.0, 263.6666666666667, 161, 377, 253.0, 377.0, 377.0, 377.0, 0.03252208791804433, 0.026794728034039785, 0.020855635806818797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2a47cf9-e84c-4c2d-904e-e8c08e796369", 3, 0, 0.0, 468.66666666666663, 170, 898, 338.0, 898.0, 898.0, 898.0, 0.02500458417376519, 0.02507783979146177, 0.01603484076247312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bacb78f8-b23b-4f2f-8f1f-827d162e2025", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 0.24250209731543623, 0.9254404362416108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bc1a8c6-210a-4998-b074-0f66f7c94e81", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd585fb4-b80d-4dc9-b3ab-d4320a478a81", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/950db14f-271c-4a9a-b852-28f69aa052fe", 3, 0, 0.0, 304.0, 170, 382, 360.0, 382.0, 382.0, 382.0, 0.03343922420999833, 0.027876905339129465, 0.021443773337791894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 92.16666666666667, 85, 101, 92.0, 101.0, 101.0, 101.0, 0.033772374197906116, 0.026582552347180006, 0.012005023640661939], "isController": false}, {"data": ["deleteAccount", 17, 2, 11.764705882352942, 550.7647058823529, 83, 1236, 397.0, 1105.6, 1236.0, 1236.0, 0.09708294309797383, 0.021153240071841377, 0.06511048717077461], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/64a290cb-fb14-424e-b2a0-b74a060daba5", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1212.9199999999998, 727, 2598, 1077.0, 1914.6000000000004, 2423.3999999999996, 2598.0, 0.10951127309045193, 0.056680639392519064, 0.05037090783750279], "isController": false}, {"data": ["goToProfile", 17, 2, 11.764705882352942, 205.82352941176467, 83, 408, 175.0, 369.59999999999997, 408.0, 408.0, 0.09961093142080345, 0.16264025182522385, 0.0634012591993625], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/21383fe8-4f96-4c23-8533-dcb4f18fa3eb", 3, 0, 0.0, 495.6666666666667, 175, 1026, 286.0, 1026.0, 1026.0, 1026.0, 0.05282341133590407, 0.03430426615075802, 0.03387438812881869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, 100.0, 86.33333333333333, 84, 89, 86.5, 89.0, 89.0, 89.0, 0.034685489325540664, 0.01724112701826191, 0.017410489759109277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c32b4567-a76c-4c5a-9d7d-b8e624a1689f", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f1158c7-c98b-4ee5-a50e-4a9cae46abc3", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["addBook", 51, 51, 100.0, 609.0, 343, 1709, 527.0, 818.2000000000005, 1626.1999999999998, 1709.0, 0.24562451236310046, 0.8810152043379216, 0.47924153046948], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c32b4567-a76c-4c5a-9d7d-b8e624a1689f", 3, 0, 0.0, 575.3333333333334, 197, 952, 577.0, 952.0, 952.0, 952.0, 0.03679943083546974, 0.03067817134428321, 0.023598593341756315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 123.89473684210525, 85, 267, 89.0, 258.0, 267.0, 267.0, 0.1295805001807307, 0.09680574476392478, 0.04606181842361911], "isController": false}, {"data": ["deleteBooks", 17, 2, 11.764705882352942, 463.47058823529414, 86, 911, 453.0, 857.4, 911.0, 911.0, 0.09897531439217513, 0.019211718022240337, 0.0674087389380531], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 157, 6, 3.821656050955414, 165.05732484076444, 82, 1389, 90.0, 266.0, 384.9999999999996, 1349.559999999999, 0.6402100867749723, 1.5220719244939487, 0.30323246838707835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 112.85714285714286, 85, 254, 87.0, 254.0, 254.0, 254.0, 0.034865766797828365, 0.027000540108083875, 0.01239369054141555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, 100.0, 86.4, 84, 90, 86.0, 89.8, 90.0, 90.0, 0.04929556635676187, 0.02450336257382011, 0.024744063581421488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5708ce39-b443-4b1d-9cbe-e76776f1215b", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.6882240032327586, 1.2859476023706895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 124.9375, 83, 303, 88.0, 286.20000000000005, 303.0, 303.0, 0.09748310800519097, 0.07910982690655635, 0.03465219854872023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5155a248-062c-42d7-b3bc-d1e8b037948b", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 0.6339089912280702, 2.419133771929825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f1158c7-c98b-4ee5-a50e-4a9cae46abc3", 3, 0, 0.0, 479.3333333333333, 234, 690, 514.0, 690.0, 690.0, 690.0, 0.07503939568273343, 0.03395337239550764, 0.048120966632482054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f97c723a-cbbc-49f5-b789-386ee9f46c94", 3, 0, 0.0, 236.0, 175, 349, 184.0, 349.0, 349.0, 349.0, 0.021356265216338967, 0.02141883239958996, 0.013695261222717373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 510.59999999999985, 122, 1201, 404.0, 1088.6000000000001, 1170.6999999999998, 1201.0, 0.11280366747283688, 0.06929053402384218, 0.05100400199211277], "isController": false}, {"data": ["login", 25, 3, 12.0, 1986.2000000000003, 1111, 3162, 2074.0, 2773.0000000000014, 3152.4, 3162.0, 0.10625863351397301, 0.15646583784932525, 0.15987358543194133], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, 100.0, 109.0, 83, 247, 86.0, 247.0, 247.0, 247.0, 0.034979711767175035, 0.017387376259269623, 0.01755817563313278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 97.875, 85, 247, 88.0, 137.1000000000001, 247.0, 247.0, 0.07382491498599635, 0.05976645949549898, 0.026242450248928382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91700242-5786-499e-91a4-ce8ea8f1a36f", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, 100.0, 98.5625, 84, 263, 86.0, 153.80000000000013, 263.0, 263.0, 0.08355833154901479, 0.041534365975047394, 0.041942365640814064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb8c2974-dec5-43fd-8396-25e7361f05ff", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.0949337121212122, 4.178503787878788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f97c723a-cbbc-49f5-b789-386ee9f46c94", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb8c2974-dec5-43fd-8396-25e7361f05ff", 3, 0, 0.0, 280.6666666666667, 167, 397, 278.0, 397.0, 397.0, 397.0, 0.07812093120149992, 0.03534768696942867, 0.05009708153221186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5155a248-062c-42d7-b3bc-d1e8b037948b", 3, 0, 0.0, 280.3333333333333, 213, 365, 263.0, 365.0, 365.0, 365.0, 0.08050449483429492, 0.03642618744129881, 0.051625603783711255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9062ffa6-09de-4ed9-b467-dce4dbb5e454", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bacb78f8-b23b-4f2f-8f1f-827d162e2025", 3, 0, 0.0, 318.6666666666667, 202, 408, 346.0, 408.0, 408.0, 408.0, 0.04431707389133453, 0.029010949087068277, 0.028419477723284188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90c66f4e-1287-483f-b4e2-0babffc7f753", 3, 0, 0.0, 561.3333333333333, 206, 1236, 242.0, 1236.0, 1236.0, 1236.0, 0.07572506752151854, 0.03352411843400561, 0.048560671555140475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af06af1a-a8ef-4b4c-8afb-09fe90ca8d63", 3, 0, 0.0, 248.0, 173, 398, 173.0, 398.0, 398.0, 398.0, 0.03437016669530847, 0.02865299378472819, 0.022040764449790917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 130.7, 83, 321, 90.0, 315.0, 321.0, 321.0, 0.050072856005487984, 0.041515483152987594, 0.017799335533200806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 95.18749999999999, 82, 249, 85.0, 135.6000000000001, 249.0, 249.0, 0.15551646044536027, 0.07730261559246912, 0.07806197330948748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebd86bc2-6aa0-4b09-a4de-eb88cd0b2901", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=206503c1-8c16-477f-a2bb-b19644cc3b9f", 1, 0, 0.0, 911.0, 911, 911, 911.0, 911.0, 911.0, 911.0, 1.0976948408342482, 0.19831400933040613, 0.7568091383095499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 111.75, 83, 298, 88.0, 262.3, 298.0, 298.0, 0.16042190962230668, 0.12454630678684941, 0.05702497568605432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33afd21d-4611-4fc2-9b09-3a54c831177c", 3, 0, 0.0, 471.6666666666667, 161, 1073, 181.0, 1073.0, 1073.0, 1073.0, 0.04834576893945498, 0.030074467592219555, 0.031002983336824972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 116.1875, 81, 255, 84.5, 253.6, 255.0, 255.0, 0.0974166326723209, 0.04842291604512826, 0.048898583196848575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 107.28571428571428, 83, 247, 84.0, 247.0, 247.0, 247.0, 0.05789813237167292, 0.028779442751153825, 0.033076569763113926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af06af1a-a8ef-4b4c-8afb-09fe90ca8d63", 1, 0, 0.0, 793.0, 793, 793, 793.0, 793.0, 793.0, 793.0, 1.2610340479192939, 0.22782353404791927, 0.8694238650693569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/206503c1-8c16-477f-a2bb-b19644cc3b9f", 3, 0, 0.0, 380.66666666666663, 206, 718, 218.0, 718.0, 718.0, 718.0, 0.020266436079660603, 0.023954241342854055, 0.01299637990785527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ee67837-1ae7-44d1-9b15-2e8bb7e092cc", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.8566042877906979, 3.4690679505813957], "isController": false}, {"data": ["register", 26, 4, 15.384615384615385, 967.2692307692307, 130, 1486, 984.5, 1456.7, 1485.3, 1486.0, 0.11061146870759007, 0.03526405297438494, 0.04990478373330724], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.197802197802198, 0.6745362563237775], "isController": false}, {"data": ["401/Unauthorized", 10, 5.4945054945054945, 1.6863406408094435], "isController": false}, {"data": ["404/Not Found", 168, 92.3076923076923, 28.33052276559865], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 593, 182, "404/Not Found", 168, "401/Unauthorized", 10, "406/Not Acceptable", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 55, 55, "404/Not Found", 55, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 157, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

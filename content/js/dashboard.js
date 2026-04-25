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

    var data = {"OkPercent": 98.01375095492743, "KoPercent": 1.9862490450725745};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7552356020942408, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/773a4b0d-49ed-46dd-8777-27817c0c6157"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fe9c9d86-ee69-4f3b-877a-91a80b5d0563"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca62c53c-0d20-4552-bbd6-c9f360bfc0af"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb1b5a4b-36b2-446c-9e0c-8308afce7b22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db0ca171-7aa5-47b5-b93f-218ada5a8291"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf4ceaff-8a59-4688-9ef6-69764b67316c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b7303c7-2f0c-42b7-92b2-3affe975c39f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27f84656-ac31-4d3f-8b80-6dbb0538b04b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/09877b49-9825-472a-8a7b-b9d785feb226"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/00dc72fb-27f7-4813-81a0-bf58562954d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99c616d8-fe57-48f5-b64d-e3b3032b6b98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b2e1907-4e9e-47c8-82c0-718dbd464b94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b7303c7-2f0c-42b7-92b2-3affe975c39f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9a5489ab-b333-4695-925d-f641ebdc9171"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0942b20-f8ca-4fda-997c-54bff9850333"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe9c9d86-ee69-4f3b-877a-91a80b5d0563"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c745e0d-3ddd-4214-aae6-9290b04b267b"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0942b20-f8ca-4fda-997c-54bff9850333"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.32727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=773a4b0d-49ed-46dd-8777-27817c0c6157"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09877b49-9825-472a-8a7b-b9d785feb226"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e8819c2-06fb-49a6-a30d-5ae3c834a797"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27f84656-ac31-4d3f-8b80-6dbb0538b04b"], "isController": false}, {"data": [0.2786885245901639, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf4ceaff-8a59-4688-9ef6-69764b67316c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db0ca171-7aa5-47b5-b93f-218ada5a8291"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b2e1907-4e9e-47c8-82c0-718dbd464b94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00dc72fb-27f7-4813-81a0-bf58562954d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4727272727272727, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9350282485875706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb1b5a4b-36b2-446c-9e0c-8308afce7b22"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37ad34b2-18d1-4345-a76d-ca025f9bb9f5"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a5489ab-b333-4695-925d-f641ebdc9171"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 26, 1.9862490450725745, 419.6615737203968, 120, 2311, 141.0, 1164.0, 1438.5, 1863.000000000001, 5.064221603218818, 706.791227500677, 3.6918618884923395], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2050.1090909090904, 1519, 2845, 2024.0, 2459.4, 2636.4, 2845.0, 0.24804607343065757, 298.4824372105189, 1.2196406051985946], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/773a4b0d-49ed-46dd-8777-27817c0c6157", 3, 0, 0.0, 346.3333333333333, 253, 477, 309.0, 477.0, 477.0, 477.0, 0.047924088244221154, 0.03137218146456014, 0.030732569609738178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe9c9d86-ee69-4f3b-877a-91a80b5d0563", 3, 0, 0.0, 659.3333333333333, 216, 1505, 257.0, 1505.0, 1505.0, 1505.0, 0.018452113689623146, 0.025425715250056893, 0.011832898427264843], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 424.59999999999997, 129, 719, 473.0, 590.6000000000001, 719.0, 719.0, 0.08287979666823217, 0.016867333618808187, 0.055539176243887614], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 424.59999999999997, 129, 719, 473.0, 590.6000000000001, 719.0, 719.0, 0.08110826330986601, 0.01650679890017195, 0.05435204129221685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 193.50000000000003, 124, 506, 127.0, 466.5, 506.0, 506.0, 0.10106624892617111, 0.037885743703211745, 0.057033060394302754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 130.14285714285714, 124, 144, 128.0, 141.5, 144.0, 144.0, 0.10106406017642898, 0.07510717753345941, 0.05072942083074657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 245.85714285714283, 123, 1016, 127.5, 719.0, 1016.0, 1016.0, 0.10106478974914276, 2.1478946715394334, 0.05889336311135174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 254.6428571428571, 125, 1404, 128.0, 892.5, 1404.0, 1404.0, 0.10106478974914276, 6.52088550126331, 0.058794667027612345], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 253.00000000000003, 125, 372, 253.0, 366.0, 372.0, 372.0, 0.08264144082597365, 0.13790252407620643, 0.05341025931506774], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ca62c53c-0d20-4552-bbd6-c9f360bfc0af", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb1b5a4b-36b2-446c-9e0c-8308afce7b22", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db0ca171-7aa5-47b5-b93f-218ada5a8291", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 127.52941176470588, 124, 131, 128.0, 131.0, 131.0, 131.0, 0.0803562143714726, 0.05971785071942446, 0.04033505291693058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 156.41176470588235, 120, 378, 127.0, 376.4, 378.0, 378.0, 0.0803562143714726, 0.042800024106864315, 0.04463721237202091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 864.75, 719, 991, 874.5, 991.0, 991.0, 991.0, 0.05425273637239078, 15.952105853870254, 0.030941013712379117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf4ceaff-8a59-4688-9ef6-69764b67316c", 3, 0, 0.0, 340.6666666666667, 208, 451, 363.0, 451.0, 451.0, 451.0, 0.08842775452455344, 0.040011256116253016, 0.056706600394977304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1264.5, 1128, 1406, 1262.0, 1406.0, 1406.0, 1406.0, 0.05412646648895143, 48.70308969093788, 0.0308161425420495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 253.5, 127, 391, 248.0, 391.0, 391.0, 391.0, 0.05488549513577299, 0.0971215988144733, 0.030390698966780552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 142.625, 122, 380, 126.0, 210.60000000000016, 380.0, 380.0, 0.08070414365337569, 0.059976419258026284, 0.04050969710726085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 203.06250000000003, 121, 376, 127.5, 375.3, 376.0, 376.0, 0.080705364889131, 0.021594990214474506, 0.046027278413332526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b7303c7-2f0c-42b7-92b2-3affe975c39f", 3, 0, 0.0, 302.0, 207, 462, 237.0, 462.0, 462.0, 462.0, 0.016040550511693563, 0.022113193820645256, 0.010286420738293072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 173.12500000000003, 121, 379, 128.0, 379.0, 379.0, 379.0, 0.0807037365830038, 0.02175217900088774, 0.047444970139617466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27f84656-ac31-4d3f-8b80-6dbb0538b04b", 1, 0, 0.0, 627.0, 627, 627, 627.0, 627.0, 627.0, 627.0, 1.594896331738437, 0.2881404505582137, 1.099606259968102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 203.8125, 122, 387, 127.5, 385.6, 387.0, 387.0, 0.0807057719759295, 0.02175272760288725, 0.04752498095848192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 129.25, 127, 132, 129.0, 132.0, 132.0, 132.0, 0.054883235915589586, 0.04078724856617546, 0.03081822329244532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 340.5882352941176, 126, 1379, 127.0, 1179.7999999999997, 1379.0, 1379.0, 0.0803562143714726, 12.777482822382042, 0.04602202764726458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 928.9374999999999, 126, 1709, 1288.5, 1560.6000000000001, 1709.0, 1709.0, 0.09253101234710696, 52.04658222609375, 0.04942818725963624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 266.47058823529414, 122, 1162, 127.0, 1025.9999999999998, 1162.0, 1162.0, 0.08035697403997051, 4.1874163194378795, 0.046100936336005593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 612.0624999999999, 126, 1137, 725.5, 1059.3000000000002, 1137.0, 1137.0, 0.09239689084462308, 16.989185052204245, 0.04944677361606782], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 364.20000000000005, 128, 627, 429.0, 595.8000000000001, 627.0, 627.0, 0.0812435682175161, 0.016534335563017928, 0.054855276431240864], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/09877b49-9825-472a-8a7b-b9d785feb226", 3, 0, 0.0, 483.6666666666667, 232, 643, 576.0, 643.0, 643.0, 643.0, 0.061828898827311886, 0.027975966591785, 0.039649391500587376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 381.4375, 253, 753, 265.5, 585.7000000000002, 753.0, 753.0, 0.08065207200213728, 0.12499495924549986, 0.1813884002157443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 604.2380952380953, 132, 1243, 579.0, 1055.6000000000001, 1225.7999999999997, 1243.0, 0.10298358147472489, 0.06325846948008003, 0.046563865451950806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 130.1875, 126, 145, 128.0, 140.8, 145.0, 145.0, 0.09253208260801674, 0.06876651842255932, 0.04644676802785215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 267.81249999999994, 126, 394, 362.0, 386.3, 394.0, 394.0, 0.09240756355907731, 0.11147113563120142, 0.0478506939230476], "isController": false}, {"data": ["login", 21, 0, 0.0, 2572.5714285714284, 1866, 4266, 2602.0, 3477.0000000000005, 4198.999999999999, 4266.0, 0.10318852543597153, 23.65762976264182, 0.1882816300470245], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/00dc72fb-27f7-4813-81a0-bf58562954d4", 3, 0, 0.0, 416.3333333333333, 344, 518, 387.0, 518.0, 518.0, 518.0, 0.03184814803019204, 0.02655049059418028, 0.0204234543032156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99c616d8-fe57-48f5-b64d-e3b3032b6b98", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.8845870844875346, 1.6528523199445984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b2e1907-4e9e-47c8-82c0-718dbd464b94", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 154.17647058823525, 129, 431, 136.0, 218.99999999999983, 431.0, 431.0, 0.07662351710958065, 0.0620321246912523, 0.027237265847546245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b7303c7-2f0c-42b7-92b2-3affe975c39f", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a5489ab-b333-4695-925d-f641ebdc9171", 3, 0, 0.0, 863.6666666666666, 324, 1905, 362.0, 1905.0, 1905.0, 1905.0, 0.07347718533395381, 0.03324651289524603, 0.04711915856376595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1076.0625, 254, 1836, 1418.5, 1689.0000000000002, 1836.0, 1836.0, 0.09232917659686196, 69.08978083722366, 0.19288592874495794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0942b20-f8ca-4fda-997c-54bff9850333", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe9c9d86-ee69-4f3b-877a-91a80b5d0563", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 452.00000000000006, 254, 1528, 264.5, 1081.0, 1528.0, 1528.0, 0.10097003353647542, 8.773539484241462, 0.2252386769319534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, 60.0, 634.7, 125, 1537, 134.0, 1533.5, 1537.0, 1537.0, 0.08044858128926898, 38.51070443794599, 0.10454387414221701], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1206.0, 390, 2182, 1217.5, 1792.2, 2127.399999999999, 2182.0, 0.08551427116575387, 0.02717871899621794, 0.038581634061111605], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8c745e0d-3ddd-4214-aae6-9290b04b267b", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 493.52941176470586, 252, 1503, 259.0, 1332.6, 1503.0, 1503.0, 0.080306866709497, 17.056896160268888, 0.1769860375292884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 129.92857142857147, 126, 139, 129.0, 136.5, 139.0, 139.0, 0.07750950875580628, 0.060175839317251956, 0.02755220819054052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0942b20-f8ca-4fda-997c-54bff9850333", 3, 0, 0.0, 391.6666666666667, 241, 496, 438.0, 496.0, 496.0, 496.0, 0.022845306812470493, 0.02291223642227265, 0.01465014792336161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 434.26315789473693, 253, 897, 267.0, 757.0, 897.0, 897.0, 0.09130138105352183, 0.14149930833197183, 0.20533894586548904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 146.49999999999997, 123, 382, 128.0, 258.5, 382.0, 382.0, 0.0666070375092774, 0.049499956586484484, 0.03343361062477401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 144.0, 120, 379, 126.0, 255.0, 379.0, 379.0, 0.06660735440345977, 0.017822671002488258, 0.03798700680822315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 145.8571428571429, 123, 387, 127.0, 260.0, 387.0, 387.0, 0.0666076713006575, 0.017952848905255343, 0.039158025510738104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 145.85714285714286, 121, 386, 128.0, 259.5, 386.0, 386.0, 0.0666070375092774, 0.017952678078672426, 0.0392226988457952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 138.0, 128, 150, 136.0, 150.0, 150.0, 150.0, 0.035827740224998204, 0.010566384324169394, 0.022147421447679557], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1413.7090909090905, 959, 2311, 1375.0, 1935.0, 2111.2, 2311.0, 0.24324443854760958, 291.0049139522798, 0.48031274877272123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=773a4b0d-49ed-46dd-8777-27817c0c6157", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1206.0, 390, 2182, 1217.5, 1792.2, 2127.399999999999, 2182.0, 0.08542163341694299, 0.02714927624579687, 0.03853983851428483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 128.66666666666669, 127, 131, 128.5, 131.0, 131.0, 131.0, 0.04199328107502799, 0.01131850153975364, 0.024728465320548714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 167.33333333333331, 121, 376, 126.5, 376.0, 376.0, 376.0, 0.04199445673171141, 0.011318818415969092, 0.02468814741454128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 409.78571428571433, 124, 1591, 127.5, 1492.5, 1591.0, 1591.0, 0.07709251101321586, 14.880892715790198, 0.04390229212555066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 336.21428571428567, 120, 994, 129.0, 917.0, 994.0, 994.0, 0.07736687371515727, 4.891047841049758, 0.044134088535334556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 182.71428571428567, 126, 383, 128.0, 382.5, 383.0, 383.0, 0.07763157165116809, 0.0576929941665419, 0.038967409988965224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 128.83333333333331, 124, 135, 128.0, 135.0, 135.0, 135.0, 0.04199416281136922, 0.011236719346010903, 0.023949795978359008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 198.14285714285717, 122, 381, 127.5, 379.0, 381.0, 381.0, 0.07752753611952531, 0.045696685282504805, 0.0428196868718193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 126.33333333333334, 124, 130, 126.5, 130.0, 130.0, 130.0, 0.041995044584738996, 0.03120920793846326, 0.02107954386382407], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 573.1333333333332, 126, 1905, 463.0, 1665.0000000000002, 1905.0, 1905.0, 0.08059619693412068, 0.015961824939687178, 0.05484319338251492], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 212.66666666666666, 129, 378, 131.0, 378.0, 378.0, 378.0, 0.03920697361370676, 0.03086017649672622, 0.013936853901747325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1431.6190476190475, 1062, 2155, 1315.0, 2070.0, 2151.9, 2155.0, 0.10059542913531044, 0.05206599359542435, 0.0462699678932922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09877b49-9825-472a-8a7b-b9d785feb226", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 297.6666666666667, 252, 503, 256.5, 503.0, 503.0, 503.0, 0.041956868339347156, 0.06502495122514056, 0.09436198025929345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e8819c2-06fb-49a6-a30d-5ae3c834a797", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27f84656-ac31-4d3f-8b80-6dbb0538b04b", 3, 0, 0.0, 328.3333333333333, 214, 484, 287.0, 484.0, 484.0, 484.0, 0.024216202253721224, 0.024287148158761422, 0.015529270325465758], "isController": false}, {"data": ["addBook", 61, 10, 16.39344262295082, 1277.9999999999995, 641, 3884, 1018.0, 2234.8, 2441.2, 3884.0, 0.27284397350282463, 92.03542128395453, 0.9900815205236815], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf4ceaff-8a59-4688-9ef6-69764b67316c", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db0ca171-7aa5-47b5-b93f-218ada5a8291", 3, 0, 0.0, 357.0, 312, 446, 313.0, 446.0, 446.0, 446.0, 0.04734997948167556, 0.030441474438902744, 0.03036440741500679], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 239.9272727272728, 121, 636, 131.0, 509.8, 513.8, 636.0, 0.24449551684129572, 0.1817002815588145, 0.11818875081683729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b2e1907-4e9e-47c8-82c0-718dbd464b94", 3, 0, 0.0, 362.0, 295, 479, 312.0, 479.0, 479.0, 479.0, 0.027465987951586616, 0.032463867920641605, 0.017613280034057825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00dc72fb-27f7-4813-81a0-bf58562954d4", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 784.6363636363636, 612, 1142, 751.0, 1006.4, 1048.5999999999997, 1142.0, 0.24437710497551784, 71.85498294636588, 0.12290450103749188], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 206.090909090909, 121, 515, 130.0, 382.2, 417.3999999999995, 515.0, 0.2449223150947849, 0.43339769038256865, 0.11911261027070595], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1169.9999999999995, 830, 1802, 1134.0, 1431.0, 1600.3999999999999, 1802.0, 0.2438062139554677, 219.3772598827403, 0.12237929098936562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 131.8947368421053, 127, 148, 130.0, 141.0, 148.0, 148.0, 0.0899140138088996, 0.06717209039434394, 0.03196162209613228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, 5.649717514124294, 191.6327683615819, 124, 1773, 134.0, 296.6, 371.99999999999994, 1223.8799999999992, 0.7321189258946741, 1.563326445159329, 0.35329116798820337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 211.71428571428572, 127, 471, 134.0, 431.5, 471.0, 471.0, 0.06842552858720834, 0.05298969157192989, 0.02432313711498421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 132.0, 127, 139, 131.0, 139.0, 139.0, 139.0, 0.09680073568559121, 0.07855606577609989, 0.0344096365132375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb1b5a4b-36b2-446c-9e0c-8308afce7b22", 3, 0, 0.0, 408.3333333333333, 372, 463, 390.0, 463.0, 463.0, 463.0, 0.05201921242912382, 0.033443341324062355, 0.03335867463716599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 312.6428571428571, 253, 768, 257.5, 641.5, 768.0, 768.0, 0.06656713295358369, 0.10316605468489973, 0.1497110421797883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37ad34b2-18d1-4345-a76d-ca025f9bb9f5", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 664.6428571428572, 253, 1971, 379.5, 1746.5, 1971.0, 1971.0, 0.07703609140882503, 19.8427958615799, 0.169032316640346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a5489ab-b333-4695-925d-f641ebdc9171", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 132.8125, 127, 146, 131.0, 142.5, 146.0, 146.0, 0.08339022979220198, 0.0691389698179487, 0.029642620746446795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 132.8125, 125, 151, 131.0, 145.4, 151.0, 151.0, 0.09088533678697613, 0.07056039330629495, 0.032306897060995425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 185.73684210526318, 122, 508, 128.0, 376.0, 508.0, 508.0, 0.09146664355930408, 0.06797472241077188, 0.04591196756785381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 205.42105263157893, 120, 386, 127.0, 385.0, 386.0, 386.0, 0.09135976996571604, 0.024445875947857614, 0.052103618808572436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 218.421052631579, 125, 388, 129.0, 379.0, 388.0, 388.0, 0.09135933067269317, 0.02462419459537433, 0.05370929400875126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 193.26315789473685, 122, 384, 129.0, 381.0, 384.0, 384.0, 0.09146972592781595, 0.02465394956648164, 0.0538635202485088], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 15.384615384615385, 0.30557677616501144], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.22918258212375858], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.538461538461538, 0.22918258212375858], "isController": false}, {"data": ["401/Unauthorized", 16, 61.53846153846154, 1.2223071046600458], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 26, "401/Unauthorized", 16, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

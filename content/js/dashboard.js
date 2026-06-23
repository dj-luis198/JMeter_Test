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

    var data = {"OkPercent": 98.27213822894169, "KoPercent": 1.7278617710583153};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8119975262832406, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/488f9b84-fd0c-4db8-8bbc-97790977e780"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9efb3374-47b4-41c2-b8c8-0edec150db20"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/348996e2-3d00-4bea-a0c0-bbc76b2a3c13"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a4c0be0e-739a-4563-928b-9aa486ef3dd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d1ec1af-224a-40b2-b297-e6ec535e680b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b66b258-a88c-4d11-9bdd-d820ccc02b5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e46c86e-c855-4378-ab0c-66d05fd0cc1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/29c51104-f59b-4e78-a4ef-1364bf7a74bd"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b8ea34c-32de-4f8d-bbf4-b63156cd9e6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7fe73520-7c2a-4953-84f6-1503e302f990"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b539bbd-b322-4962-aa7a-c6d33b3cecb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c30e1c53-6a1f-4523-bcea-879e00433e65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c997a96-8741-4d6f-be26-eb734b50873c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=488f9b84-fd0c-4db8-8bbc-97790977e780"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29c51104-f59b-4e78-a4ef-1364bf7a74bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9efb3374-47b4-41c2-b8c8-0edec150db20"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=348996e2-3d00-4bea-a0c0-bbc76b2a3c13"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8797cba7-ec68-4f78-bb93-3b2a4036254c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4c0be0e-739a-4563-928b-9aa486ef3dd7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aedddb70-0567-4e1a-921d-c1ee1a1aeeca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b66b258-a88c-4d11-9bdd-d820ccc02b5e"], "isController": false}, {"data": [0.4016393442622951, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21670380-f13a-42fc-b80d-868900dbf488"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9395604395604396, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21670380-f13a-42fc-b80d-868900dbf488"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aedddb70-0567-4e1a-921d-c1ee1a1aeeca"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fe73520-7c2a-4953-84f6-1503e302f990"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8797cba7-ec68-4f78-bb93-3b2a4036254c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8b539bbd-b322-4962-aa7a-c6d33b3cecb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d1ec1af-224a-40b2-b297-e6ec535e680b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c997a96-8741-4d6f-be26-eb734b50873c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1389, 24, 1.7278617710583153, 298.7940964722821, 76, 2022, 96.0, 807.0, 1007.0, 1545.3999999999987, 5.389549163630438, 774.0836156759635, 3.9439792995623173], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/488f9b84-fd0c-4db8-8bbc-97790977e780", 3, 0, 0.0, 723.6666666666666, 253, 1057, 861.0, 1057.0, 1057.0, 1057.0, 0.017165220973611332, 0.023663642846108075, 0.011007644960291123], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1309.25, 970, 1746, 1273.5, 1633.7, 1699.6499999999999, 1746.0, 0.26109774193969515, 314.1879986014952, 1.283815557291372], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 524.9999999999999, 86, 1242, 444.0, 1104.0, 1242.0, 1242.0, 0.07133515634288433, 0.013974445666389251, 0.048030480917845675], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 524.9999999999999, 86, 1242, 444.0, 1104.0, 1242.0, 1242.0, 0.07222650231124808, 0.014149058948863636, 0.04863063065774268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 119.8125, 79, 238, 80.5, 236.6, 238.0, 238.0, 0.09509884336031764, 0.03437349550657965, 0.053736883046253694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 81.5625, 79, 86, 81.0, 84.6, 86.0, 86.0, 0.09509714767992677, 0.07067278260197683, 0.04773431045652574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 181.625, 79, 641, 89.0, 426.10000000000025, 641.0, 641.0, 0.09509940860055277, 1.7716792289518262, 0.05549013343635769], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9efb3374-47b4-41c2-b8c8-0edec150db20", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 144.87499999999997, 77, 778, 80.5, 405.60000000000036, 778.0, 778.0, 0.09509940860055277, 5.37219368517638, 0.05539726292014621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/348996e2-3d00-4bea-a0c0-bbc76b2a3c13", 3, 0, 0.0, 308.0, 183, 383, 358.0, 383.0, 383.0, 383.0, 0.022612497173437853, 0.0268597012323811, 0.014500852679580916], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 261.9375, 79, 1212, 188.0, 577.1000000000006, 1212.0, 1212.0, 0.07178622063494912, 0.1361151568753253, 0.04639990701441109], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 97.375, 79, 317, 81.5, 169.30000000000015, 317.0, 317.0, 0.08585809802848342, 0.06380665292937097, 0.04309674061195359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 108.8125, 78, 235, 80.5, 233.6, 235.0, 235.0, 0.08579962569913288, 0.04712066845952135, 0.047581506292866296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 589.7142857142858, 467, 646, 628.0, 646.0, 646.0, 646.0, 0.0568172594600737, 16.706160791829678, 0.03240359328582328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 764.7142857142858, 560, 939, 766.0, 939.0, 939.0, 939.0, 0.05660865627223911, 50.93656842116436, 0.03222934238937051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 198.7142857142857, 80, 253, 241.0, 253.0, 253.0, 253.0, 0.05692491603574885, 0.1007304178288837, 0.03151994862526328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 81.2142857142857, 78, 84, 81.0, 83.5, 84.0, 84.0, 0.07887723884591331, 0.05861872925951175, 0.03959267653007758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 137.07142857142856, 78, 246, 81.5, 244.0, 246.0, 246.0, 0.07887901649134867, 0.021106299334599156, 0.044985689092722284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 90.71428571428572, 77, 234, 80.0, 159.5, 234.0, 234.0, 0.07887812765861546, 0.0212601203454862, 0.04637171176805323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 114.57142857142857, 78, 244, 81.0, 241.5, 244.0, 244.0, 0.07887901649134867, 0.02126035991368382, 0.0464492645940266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4c0be0e-739a-4563-928b-9aa486ef3dd7", 3, 0, 0.0, 291.3333333333333, 178, 516, 180.0, 516.0, 516.0, 516.0, 0.024326165223314197, 0.033535582591385296, 0.015599786943336252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 82.57142857142857, 80, 86, 82.0, 86.0, 86.0, 86.0, 0.057003257328990226, 0.04236277229234528, 0.032008665004071665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 534.8235294117648, 79, 993, 781.0, 946.5999999999999, 993.0, 993.0, 0.0746747256801989, 39.533257912775525, 0.04012565395292857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 244.99999999999997, 78, 892, 81.0, 805.9000000000001, 892.0, 892.0, 0.08579962569913288, 14.494287244746115, 0.04905828207699444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 396.82352941176464, 78, 704, 470.0, 704.0, 704.0, 704.0, 0.07467538172298069, 12.924194604044771, 0.040198931647866046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 190.3125, 76, 644, 80.5, 644.0, 644.0, 644.0, 0.08587053942799487, 4.752953225377965, 0.0491826868891787], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 463.79999999999995, 81, 1968, 426.0, 1115.4000000000005, 1968.0, 1968.0, 0.0724133935812768, 0.014185670656644653, 0.049237336104352526], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 232.14285714285714, 161, 327, 167.0, 326.0, 327.0, 327.0, 0.07884081476350571, 0.12218786428680035, 0.17731484023472036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 522.2173913043478, 157, 1623, 426.0, 977.2000000000003, 1506.7999999999984, 1623.0, 0.1006370764491739, 0.061817110436064825, 0.04550289687106202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 91.58823529411764, 79, 241, 81.0, 119.39999999999989, 241.0, 241.0, 0.0746711176509345, 0.055492891144883934, 0.037481400852129226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d1ec1af-224a-40b2-b297-e6ec535e680b", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 154.35294117647058, 79, 240, 83.0, 239.2, 240.0, 240.0, 0.07467406964894402, 0.08595582534613627, 0.038898464130091015], "isController": false}, {"data": ["login", 23, 0, 0.0, 2520.739130434782, 1512, 3830, 2369.0, 3675.6000000000004, 3817.2, 3830.0, 0.10083164184600815, 36.84991076536696, 0.20302043512141443], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3b66b258-a88c-4d11-9bdd-d820ccc02b5e", 3, 0, 0.0, 268.3333333333333, 176, 448, 181.0, 448.0, 448.0, 448.0, 0.04125639474118488, 0.03439375876698388, 0.026456737513064526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e46c86e-c855-4378-ab0c-66d05fd0cc1a", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 86.4375, 80, 94, 85.0, 93.3, 94.0, 94.0, 0.08552125203112974, 0.06923546673223296, 0.03040013255794065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29c51104-f59b-4e78-a4ef-1364bf7a74bd", 3, 0, 0.0, 544.3333333333333, 184, 1061, 388.0, 1061.0, 1061.0, 1061.0, 0.0767656090071648, 0.03473443897134084, 0.04922794588024565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 637.4705882352941, 162, 1075, 863.0, 1028.6, 1075.0, 1075.0, 0.07464423241579472, 52.577312523600746, 0.15664225955775488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b8ea34c-32de-4f8d-bbf4-b63156cd9e6c", 2, 0, 0.0, 230.0, 176, 284, 230.0, 284.0, 284.0, 284.0, 0.018963817037093225, 0.026649348355837064, 0.011787567914169765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fe73520-7c2a-4953-84f6-1503e302f990", 3, 0, 0.0, 312.6666666666667, 237, 396, 305.0, 396.0, 396.0, 396.0, 0.029927575267851798, 0.030015253711019332, 0.019191837004449232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b539bbd-b322-4962-aa7a-c6d33b3cecb0", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c30e1c53-6a1f-4523-bcea-879e00433e65", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c997a96-8741-4d6f-be26-eb734b50873c", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=488f9b84-fd0c-4db8-8bbc-97790977e780", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 293.3125, 163, 858, 314.0, 552.1000000000004, 858.0, 858.0, 0.0950513871561813, 7.245260658008079, 0.21225281069922175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 576.6363636363636, 79, 1026, 773.0, 1020.6, 1026.0, 1026.0, 0.08889607240989171, 67.6863092472119, 0.14897826339502182], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1007.5217391304345, 222, 1731, 1031.0, 1720.2, 1729.0, 1731.0, 0.10156049914777494, 0.03184114834014819, 0.04582124082643752], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 106.41176470588235, 81, 244, 85.0, 240.8, 244.0, 244.0, 0.08759906423587852, 0.06800903912844083, 0.031138729865097442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 344.06250000000006, 161, 1210, 167.5, 957.3000000000003, 1210.0, 1210.0, 0.08575042339271549, 19.343100465664996, 0.18874095266040689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 268.10526315789474, 161, 946, 168.0, 481.0, 946.0, 946.0, 0.08893507271612393, 5.730433772040685, 0.19881943810587016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 83.39999999999999, 80, 90, 83.0, 89.5, 90.0, 90.0, 0.05008966049228118, 0.03722483558068943, 0.025142661614289578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29c51104-f59b-4e78-a4ef-1364bf7a74bd", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 96.69999999999999, 79, 238, 81.0, 222.60000000000005, 238.0, 238.0, 0.05008940959612909, 0.020926024829320336, 0.028145943634387383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9efb3374-47b4-41c2-b8c8-0edec150db20", 3, 0, 0.0, 842.6666666666666, 296, 1528, 704.0, 1528.0, 1528.0, 1528.0, 0.062236790241271295, 0.028160526834429392, 0.03991096249196108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 184.9, 79, 804, 82.0, 747.8000000000002, 804.0, 804.0, 0.05008966049228118, 4.5192271118426985, 0.029016783792989453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=348996e2-3d00-4bea-a0c0-bbc76b2a3c13", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 137.10000000000002, 79, 644, 81.0, 587.9000000000002, 644.0, 644.0, 0.05008991139094675, 1.4849604258393818, 0.02906584506689508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 96.0, 81, 111, 96.0, 111.0, 111.0, 111.0, 0.058104064379303336, 0.017136159611864852, 0.03591784448447169], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 891.1166666666667, 626, 1413, 822.0, 1246.0, 1292.9, 1413.0, 0.26100006525001634, 312.2468163429541, 0.515373175718294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1007.5217391304345, 222, 1731, 1031.0, 1720.2, 1729.0, 1731.0, 0.10144582351955257, 0.031805195349370596, 0.045769502408235636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 119.58333333333334, 78, 244, 81.0, 241.9, 244.0, 244.0, 0.0765906929542945, 0.02064358521033719, 0.04510174594867147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 106.25000000000001, 78, 235, 81.0, 234.7, 235.0, 235.0, 0.07659215951593755, 0.02064398049453004, 0.045027812527924226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 117.3529411764706, 78, 246, 81.0, 238.0, 246.0, 246.0, 0.08789481575695532, 0.023690399559491863, 0.05167253816961631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 117.41176470588235, 79, 244, 81.0, 238.4, 244.0, 244.0, 0.08789617910139082, 0.02369076702342175, 0.051759175779432294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 83.17647058823529, 79, 91, 82.0, 87.8, 91.0, 91.0, 0.08789027158093919, 0.06531689128231906, 0.04411679647715112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 93.83333333333334, 77, 236, 80.5, 190.70000000000016, 236.0, 236.0, 0.0765911818019352, 0.020494124818095944, 0.04368090837141617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8797cba7-ec68-4f78-bb93-3b2a4036254c", 1, 0, 0.0, 1968.0, 1968, 1968, 1968.0, 1968.0, 1968.0, 1968.0, 0.508130081300813, 0.09180084476626016, 0.3503318724593496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 135.7058823529412, 79, 243, 81.0, 242.2, 243.0, 243.0, 0.08789617910139082, 0.023519094798614342, 0.05012828964376196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 95.16666666666667, 79, 245, 82.5, 196.70000000000016, 245.0, 245.0, 0.07659020411289395, 0.056919087236242484, 0.03844469229885498], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 543.5333333333333, 80, 1061, 501.0, 985.4000000000001, 1061.0, 1061.0, 0.0721670812264555, 0.013874309300893428, 0.04911214193099865], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 100.41666666666667, 81, 241, 85.0, 205.0000000000001, 241.0, 241.0, 0.07766085504601405, 0.061127587077233723, 0.027606007067137808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1322.695652173913, 919, 1807, 1314.0, 1706.4, 1797.1999999999998, 1807.0, 0.10020214693991357, 0.05186243933413495, 0.0460890734459954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 216.75, 160, 489, 164.5, 438.3000000000002, 489.0, 489.0, 0.07655014034192396, 0.11863776633069661, 0.17216305977290125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4c0be0e-739a-4563-928b-9aa486ef3dd7", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aedddb70-0567-4e1a-921d-c1ee1a1aeeca", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b66b258-a88c-4d11-9bdd-d820ccc02b5e", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 871.2131147540986, 414, 2362, 702.0, 1425.0, 1508.7, 2362.0, 0.2776905252903232, 88.2511683416299, 1.008757600924573], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 140.88333333333327, 79, 421, 84.0, 325.5, 334.84999999999997, 421.0, 0.26188751058462023, 0.1946253862840781, 0.12659601341737012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21670380-f13a-42fc-b80d-868900dbf488", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 523.1166666666664, 385, 721, 479.5, 689.4, 707.5999999999999, 721.0, 0.26184408057815173, 76.99085373171455, 0.13168916161889466], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 122.33333333333333, 78, 345, 84.0, 246.7, 255.59999999999997, 345.0, 0.2622022365850781, 0.4639750514571889, 0.12751632208922742], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 741.316666666667, 541, 1092, 705.0, 940.4, 959.85, 1092.0, 0.2614060158237775, 235.21359254099718, 0.13121356653654456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 122.26315789473685, 83, 246, 86.0, 245.0, 246.0, 246.0, 0.08818874247494744, 0.065883191399741, 0.03134834205164147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 9, 4.945054945054945, 149.79120879120882, 80, 2022, 88.0, 266.40000000000003, 338.5999999999999, 1051.7299999999855, 0.7291170072551149, 1.6251185879267038, 0.34887823145058233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 85.8, 82, 96, 84.0, 95.5, 96.0, 96.0, 0.04995079846351344, 0.0386826007632482, 0.01775594789132704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 91.99999999999999, 80, 144, 87.0, 124.40000000000002, 144.0, 144.0, 0.09145417859857903, 0.07421720939005778, 0.03250910254871364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21670380-f13a-42fc-b80d-868900dbf488", 3, 0, 0.0, 468.33333333333337, 190, 935, 280.0, 935.0, 935.0, 935.0, 0.02780042997998369, 0.02788187655219067, 0.017827749694195268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aedddb70-0567-4e1a-921d-c1ee1a1aeeca", 3, 0, 0.0, 766.3333333333334, 186, 1732, 381.0, 1732.0, 1732.0, 1732.0, 0.04469473496022169, 0.028734408055481064, 0.028661662718631745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 269.7, 160, 886, 167.5, 829.9000000000002, 886.0, 886.0, 0.050068844661409435, 6.059811733320816, 0.11132494680185255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 248.94117647058823, 161, 334, 315.0, 328.4, 334.0, 334.0, 0.0878525730468306, 0.1361543295169142, 0.19758249582700277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fe73520-7c2a-4953-84f6-1503e302f990", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8797cba7-ec68-4f78-bb93-3b2a4036254c", 3, 0, 0.0, 657.6666666666666, 210, 1003, 760.0, 1003.0, 1003.0, 1003.0, 0.09467605011518919, 0.04283844715498469, 0.06071348265850349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b539bbd-b322-4962-aa7a-c6d33b3cecb0", 3, 0, 0.0, 717.0, 201, 1392, 558.0, 1392.0, 1392.0, 1392.0, 0.07567349409746746, 0.03424028541519524, 0.0485275987539098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 98.14285714285714, 79, 240, 88.0, 168.5, 240.0, 240.0, 0.08287652581603779, 0.06871305704864852, 0.029460015036169684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 96.29411764705883, 80, 259, 85.0, 130.19999999999987, 259.0, 259.0, 0.07450976954566571, 0.057846940223441654, 0.026485894643185865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d1ec1af-224a-40b2-b297-e6ec535e680b", 3, 0, 0.0, 660.6666666666666, 285, 1212, 485.0, 1212.0, 1212.0, 1212.0, 0.03180627855938762, 0.026515585739124905, 0.020396604414711465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c997a96-8741-4d6f-be26-eb734b50873c", 3, 0, 0.0, 288.6666666666667, 170, 501, 195.0, 501.0, 501.0, 501.0, 0.022674708629994104, 0.027199316829924568, 0.014540747396187624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 97.63157894736841, 78, 236, 82.0, 232.0, 236.0, 236.0, 0.08897088778897978, 0.06611996641348986, 0.044659215159702746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 105.73684210526316, 77, 243, 80.0, 238.0, 243.0, 243.0, 0.08897047116888468, 0.030839682234938236, 0.050347701869316426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 159.1052631578947, 77, 866, 82.0, 318.0, 866.0, 866.0, 0.08897047116888468, 4.236180639615741, 0.051902490119595045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 138.6315789473684, 77, 626, 81.0, 325.0, 626.0, 626.0, 0.08897088778897978, 1.3995812075924947, 0.05198961879486591], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.503959683225342], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.14398848092152627], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.14398848092152627], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 0.9359251259899208], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1389, 24, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

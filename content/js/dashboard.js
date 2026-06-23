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

    var data = {"OkPercent": 98.6963190184049, "KoPercent": 1.303680981595092};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7356624917600527, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b9a81bc1-1a65-43aa-974a-d2c976d9f0cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97c7f920-7630-41a3-970b-d0c0ebb1661a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d116c2ac-621b-4882-8b7d-1be5944d6edd"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2095f31-fd85-489b-b0b5-51483345bb6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2aff5835-c27c-4b62-b53f-b1daf9ddcb16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afab9de8-140d-4b08-bdc3-6ba8cda7b0fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82bf8365-295a-4c7d-9c41-3e49b8140043"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19be8d51-873e-4972-9e02-b7d57b45849c"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/556afa2d-7bec-4423-b413-45acb6ee8405"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77e08bc3-8580-49ca-9d4e-752e5a8f6f5f"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2aff5835-c27c-4b62-b53f-b1daf9ddcb16"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/83e8e222-29db-4175-a7d1-759d3aeeccf0"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d9bc5fc-e9c9-425a-8a04-bc54fec6c97a"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27248181-b568-4555-af65-ebdf881f4689"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2095f31-fd85-489b-b0b5-51483345bb6f"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24561403508771928, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/afab9de8-140d-4b08-bdc3-6ba8cda7b0fa"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82bf8365-295a-4c7d-9c41-3e49b8140043"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5a9f6f1-e40a-4834-a38e-d41ec6a824f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f6f5c90-8dd0-40bc-88ee-0ae8bd62205b"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19be8d51-873e-4972-9e02-b7d57b45849c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.953757225433526, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ea806a9-7df3-4775-9312-6561da2b5370"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83e8e222-29db-4175-a7d1-759d3aeeccf0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f6f5c90-8dd0-40bc-88ee-0ae8bd62205b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77e08bc3-8580-49ca-9d4e-752e5a8f6f5f"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6b7d0205-55fb-4953-8112-c8aa51846eff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9a81bc1-1a65-43aa-974a-d2c976d9f0cc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d9bc5fc-e9c9-425a-8a04-bc54fec6c97a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27248181-b568-4555-af65-ebdf881f4689"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=556afa2d-7bec-4423-b413-45acb6ee8405"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 17, 1.303680981595092, 490.53987730061385, 142, 2695, 167.5, 1329.5, 1697.5, 2177.850000000003, 5.080770219829031, 711.8012601595923, 3.711553145236388], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2387.7192982456136, 1776, 3274, 2372.0, 2968.6, 3052.8999999999996, 3274.0, 0.2436709672454921, 293.2176644351536, 1.198128242266653], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 629.2857142857143, 152, 1038, 611.0, 999.0, 1038.0, 1038.0, 0.08070885433781268, 0.01589856338239279, 0.05430507874878216], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 629.2857142857143, 152, 1038, 611.0, 999.0, 1038.0, 1038.0, 0.08141996417521577, 0.01603864249656873, 0.054783550113987944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 206.66666666666669, 146, 443, 148.0, 442.4, 443.0, 443.0, 0.07283957811316356, 0.026783719868694524, 0.04113349612979042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 226.86666666666667, 147, 449, 149.0, 444.2, 449.0, 449.0, 0.07283851700779373, 0.054130968205987326, 0.03656152123242771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 275.1333333333334, 145, 1168, 149.0, 736.6000000000003, 1168.0, 1168.0, 0.07283957811316356, 1.4461406708282347, 0.04247552741924519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 333.8, 146, 1748, 149.0, 972.8000000000004, 1748.0, 1748.0, 0.07283922440793851, 4.38771442805427, 0.04240418910519441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9a81bc1-1a65-43aa-974a-d2c976d9f0cc", 3, 0, 0.0, 656.6666666666666, 252, 1071, 647.0, 1071.0, 1071.0, 1071.0, 0.028968154342326337, 0.024149558356346922, 0.018576583351036093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97c7f920-7630-41a3-970b-d0c0ebb1661a", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d116c2ac-621b-4882-8b7d-1be5944d6edd", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 247.35714285714292, 148, 325, 256.5, 308.0, 325.0, 325.0, 0.08126164508396069, 0.16909292232837833, 0.05252304710853654], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2095f31-fd85-489b-b0b5-51483345bb6f", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2aff5835-c27c-4b62-b53f-b1daf9ddcb16", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 148.0625, 144, 154, 148.5, 151.9, 154.0, 154.0, 0.08058991820123303, 0.059891531006971026, 0.0404523612846033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afab9de8-140d-4b08-bdc3-6ba8cda7b0fa", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 184.3125, 145, 442, 148.0, 432.2, 442.0, 442.0, 0.08059154191767573, 0.021564533677190578, 0.04596236374992444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1056.75, 881, 1173, 1086.5, 1173.0, 1173.0, 1173.0, 0.03141098127905516, 9.235871438779998, 0.017914075260711145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1486.5, 1319, 1607, 1510.0, 1607.0, 1607.0, 1607.0, 0.031275166735732655, 28.141450004691272, 0.017806076373957168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 292.5, 148, 442, 290.0, 442.0, 442.0, 442.0, 0.03155171325802991, 0.055831742601123245, 0.017470528727834923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 166.68750000000003, 147, 442, 148.0, 238.3000000000002, 442.0, 442.0, 0.08616650600203568, 0.06403585065190347, 0.04325154695805306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 165.87499999999997, 143, 447, 148.0, 238.4000000000002, 447.0, 447.0, 0.08616650600203568, 0.0311449004238315, 0.048689545444753804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 348.1875, 145, 1601, 149.0, 791.8000000000009, 1601.0, 1601.0, 0.08616697004620703, 4.867597592508321, 0.050193943000549315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 348.93750000000006, 144, 1178, 296.5, 753.1000000000004, 1178.0, 1178.0, 0.08616650600203568, 1.6052613908081879, 0.05027781966427375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 148.0, 146, 150, 148.0, 150.0, 150.0, 150.0, 0.03162555344718533, 0.023502974778621125, 0.017758489484503478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82bf8365-295a-4c7d-9c41-3e49b8140043", 3, 0, 0.0, 368.6666666666667, 232, 518, 356.0, 518.0, 518.0, 518.0, 0.04609994468006638, 0.029637822507529662, 0.02956279004548528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 973.2777777777777, 146, 1911, 1368.0, 1770.6000000000001, 1911.0, 1911.0, 0.12750674723204103, 63.75460496373141, 0.0688724596051541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 184.31250000000003, 142, 444, 148.5, 440.5, 444.0, 444.0, 0.08059194785700974, 0.021722048445834655, 0.04737925059562487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 697.5555555555554, 147, 1326, 878.5, 1292.7, 1326.0, 1326.0, 0.12750765045902757, 20.843875958078318, 0.06899746667091691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 203.43750000000003, 145, 444, 148.5, 442.6, 444.0, 444.0, 0.08059113598243113, 0.021721829620264643, 0.047457475583404275], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 654.7692307692308, 162, 1514, 555.0, 1466.3999999999999, 1514.0, 1514.0, 0.08221083918295073, 0.015575100392082463, 0.05622969431796623], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19be8d51-873e-4972-9e02-b7d57b45849c", 1, 0, 0.0, 1514.0, 1514, 1514, 1514.0, 1514.0, 1514.0, 1514.0, 0.6605019815059445, 0.1193289712681638, 0.45538515521796563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 543.375, 294, 1749, 444.5, 1143.5000000000007, 1749.0, 1749.0, 0.08609741922985858, 6.562747403961019, 0.1922583117641361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/556afa2d-7bec-4423-b413-45acb6ee8405", 3, 0, 0.0, 387.0, 256, 483, 422.0, 483.0, 483.0, 483.0, 0.031153618492787933, 0.031244888859466028, 0.019978069150648516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77e08bc3-8580-49ca-9d4e-752e5a8f6f5f", 3, 0, 0.0, 343.0, 237, 467, 325.0, 467.0, 467.0, 467.0, 0.02654350480437437, 0.026621268978605932, 0.017021713692909345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 701.809523809524, 249, 1211, 677.0, 1168.8000000000002, 1208.8999999999999, 1211.0, 0.08659865236001947, 0.05319389876411352, 0.03915544535418849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 150.72222222222223, 145, 162, 149.5, 157.5, 162.0, 162.0, 0.12749861876496338, 0.09475239148450892, 0.06399833012225702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 234.0, 146, 453, 151.5, 451.2, 453.0, 453.0, 0.12750855369881062, 0.14051398343805563, 0.06677042970382596], "isController": false}, {"data": ["login", 21, 0, 0.0, 3006.619047619048, 1683, 4534, 2819.0, 4287.6, 4512.799999999999, 4534.0, 0.08872064825220323, 20.340636129688463, 0.16188300202156333], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 154.43749999999997, 149, 189, 151.5, 169.40000000000003, 189.0, 189.0, 0.0813417318671486, 0.06585185128697872, 0.028914443749650486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2aff5835-c27c-4b62-b53f-b1daf9ddcb16", 3, 0, 0.0, 379.6666666666667, 252, 570, 317.0, 570.0, 570.0, 570.0, 0.065692951146342, 0.029082816913745153, 0.04212731567652791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83e8e222-29db-4175-a7d1-759d3aeeccf0", 3, 0, 0.0, 782.0, 264, 1612, 470.0, 1612.0, 1612.0, 1612.0, 0.057374541003671974, 0.036886301589274785, 0.03679291854727662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1141.833333333333, 298, 2060, 1515.5, 1920.5000000000002, 2060.0, 2060.0, 0.12736329672817842, 84.73816228914299, 0.2683390985862674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 601.1333333333334, 296, 2185, 300.0, 1408.6000000000004, 2185.0, 2185.0, 0.07278620749892034, 5.910458028439997, 0.1624563510211905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d9bc5fc-e9c9-425a-8a04-bc54fec6c97a", 3, 0, 0.0, 335.3333333333333, 231, 512, 263.0, 512.0, 512.0, 512.0, 0.017011335219701395, 0.023451498911274543, 0.010908961713154865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, 42.857142857142854, 998.1428571428571, 148, 1754, 1470.0, 1754.0, 1754.0, 1754.0, 0.054668707631751585, 37.379286490386114, 0.08583170140732872], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1207.4347826086957, 218, 2293, 1143.0, 1954.8, 2227.199999999999, 2293.0, 0.09079783664284868, 0.02874442382851052, 0.04096543020409774], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/27248181-b568-4555-af65-ebdf881f4689", 3, 0, 0.0, 328.3333333333333, 253, 474, 258.0, 474.0, 474.0, 474.0, 0.021304851114598792, 0.025181612759475336, 0.013662290591067588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 181.92307692307693, 148, 445, 155.0, 342.19999999999993, 445.0, 445.0, 0.06774891210881517, 0.05259803235010554, 0.024082621101180396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 407.68750000000006, 293, 595, 303.0, 594.3, 595.0, 595.0, 0.08052948133980925, 0.12480496766238015, 0.1811126909429499], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2095f31-fd85-489b-b0b5-51483345bb6f", 3, 0, 0.0, 340.6666666666667, 270, 471, 281.0, 471.0, 471.0, 471.0, 0.019880188729258334, 0.027406445074351908, 0.012748688735885066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 455.2631578947368, 297, 1461, 307.0, 591.0, 1461.0, 1461.0, 0.11340236951266823, 7.3069571794144865, 0.25351747851323525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 211.6, 144, 508, 149.0, 470.20000000000005, 508.0, 508.0, 0.086244070720138, 0.06409349396291504, 0.04329048081069426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 226.06666666666666, 147, 442, 150.0, 440.8, 442.0, 442.0, 0.08610050799299716, 0.023038612490313692, 0.04910419596475619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 148.4, 144, 152, 148.0, 151.4, 152.0, 152.0, 0.08624704603867317, 0.023246274127611127, 0.05070382980007934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 205.33333333333334, 142, 444, 148.0, 441.0, 444.0, 444.0, 0.08610742762670709, 0.023208642602510893, 0.0507058387293988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 1.8205054012345678, 3.8158275462962963], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1643.2982456140355, 1171, 2655, 1552.0, 2338.4, 2405.0999999999995, 2655.0, 0.25329618322646014, 303.0302951400461, 0.5001610180506859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1207.4347826086957, 218, 2293, 1143.0, 1954.8, 2227.199999999999, 2293.0, 0.09114903263135368, 0.02885560408030626, 0.04112387995672402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 148.33333333333334, 148, 149, 148.0, 149.0, 149.0, 149.0, 0.016618104871320476, 0.0044790985785980965, 0.009785856677154536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 246.33333333333331, 147, 443, 149.0, 443.0, 443.0, 443.0, 0.016590993302769034, 0.004471791163636967, 0.009753689422135703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afab9de8-140d-4b08-bdc3-6ba8cda7b0fa", 3, 0, 0.0, 458.0, 257, 849, 268.0, 849.0, 849.0, 849.0, 0.04141301196836046, 0.033661553022459656, 0.026557172388564487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 395.53846153846155, 144, 1600, 149.0, 1599.2, 1600.0, 1600.0, 0.0676424524031282, 9.379241880954487, 0.03887205235005489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 318.61538461538464, 143, 879, 149.0, 878.6, 879.0, 879.0, 0.06764808425829079, 3.075548599944841, 0.038941351387566284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 148.0769230769231, 146, 150, 148.0, 149.6, 150.0, 150.0, 0.0676456202062671, 0.05027179392282155, 0.03395493045509892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 246.66666666666669, 147, 443, 150.0, 443.0, 443.0, 443.0, 0.016590901549590205, 0.004439362328698942, 0.009461998540000663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 149.53846153846155, 144, 174, 148.0, 164.79999999999998, 174.0, 174.0, 0.06764632420281409, 0.03373169321351262, 0.037705508232037305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 150.66666666666666, 149, 154, 149.0, 154.0, 154.0, 154.0, 0.01661792076575379, 0.012349841506580698, 0.008341417259372508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 254.33333333333334, 152, 442, 169.0, 442.0, 442.0, 442.0, 0.016143787332508205, 0.01270692635742345, 0.005738611903352526], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 567.3846153846154, 149, 1287, 483.0, 1111.7999999999997, 1287.0, 1287.0, 0.08428969720547234, 0.015791654509498803, 0.05736663586850808], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1642.3333333333333, 818, 2695, 1565.0, 2396.4, 2672.0999999999995, 2695.0, 0.08706973041552993, 0.04506538781272545, 0.04004867482979941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 399.0, 299, 598, 300.0, 598.0, 598.0, 598.0, 0.01657715005636231, 0.025691344862741196, 0.03728239900371328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82bf8365-295a-4c7d-9c41-3e49b8140043", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5a9f6f1-e40a-4834-a38e-d41ec6a824f5", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.1404854910714284, 2.130998883928571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f6f5c90-8dd0-40bc-88ee-0ae8bd62205b", 3, 0, 0.0, 382.0, 291, 479, 376.0, 479.0, 479.0, 479.0, 0.02932981375568265, 0.024451058928484138, 0.018808506868064723], "isController": false}, {"data": ["addBook", 58, 6, 10.344827586206897, 1474.1724137931033, 760, 3425, 1166.5, 2498.3, 2759.0499999999993, 3425.0, 0.2756352680077748, 86.30481722381822, 1.0029416565085565], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 259.2982456140352, 143, 604, 150.0, 593.4, 597.3, 604.0, 0.2552848441418846, 0.18971852186716232, 0.12340429477561805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19be8d51-873e-4972-9e02-b7d57b45849c", 3, 0, 0.0, 603.0, 254, 1287, 268.0, 1287.0, 1287.0, 1287.0, 0.017701099238262696, 0.024402394294935716, 0.011351290852661951], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 966.3684210526316, 711, 1321, 881.0, 1305.2, 1318.2, 1321.0, 0.25467120606921695, 74.88179046423879, 0.1280817100836394], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 233.71929824561406, 144, 463, 152.0, 445.2, 453.2, 463.0, 0.25583482944344704, 0.4527077255385996, 0.12441967291292638], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1382.2631578947369, 1022, 2056, 1318.0, 1758.8, 1901.1, 2056.0, 0.25400616744799553, 228.55519596492263, 0.12749918951979466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 199.3157894736842, 147, 443, 153.0, 440.0, 443.0, 443.0, 0.11290437593591786, 0.08434750741306364, 0.0401339773834708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 6, 3.468208092485549, 219.05202312138724, 146, 2530, 155.0, 329.9999999999999, 396.7999999999999, 1266.8199999999845, 0.731133171892367, 1.5549828059559883, 0.3511091736610331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 202.0, 148, 508, 155.0, 475.6, 508.0, 508.0, 0.08447753460763001, 0.0654205907654791, 0.030029123630055977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ea806a9-7df3-4775-9312-6561da2b5370", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 184.6, 148, 441, 152.0, 336.00000000000006, 441.0, 441.0, 0.07072502581463441, 0.05739501606636836, 0.02514053652004583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83e8e222-29db-4175-a7d1-759d3aeeccf0", 1, 0, 0.0, 760.0, 760, 760, 760.0, 760.0, 760.0, 760.0, 1.3157894736842104, 0.2377158717105263, 0.9071751644736842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f6f5c90-8dd0-40bc-88ee-0ae8bd62205b", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77e08bc3-8580-49ca-9d4e-752e5a8f6f5f", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 439.3333333333333, 292, 947, 301.0, 912.8000000000001, 947.0, 947.0, 0.0860264387921888, 0.13332417808906602, 0.1934754770882918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 601.8461538461538, 296, 1749, 306.0, 1747.8, 1749.0, 1749.0, 0.06758969932982214, 12.528755070852203, 0.14935028589143015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b7d0205-55fb-4953-8112-c8aa51846eff", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.48828125, 0.9123542622324159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 187.31250000000003, 148, 447, 151.0, 444.2, 447.0, 447.0, 0.08420565125176963, 0.06981503702417229, 0.02993247759340249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 156.00000000000003, 145, 194, 151.0, 178.70000000000002, 194.0, 194.0, 0.12342969992868506, 0.09582676898760217, 0.04387540114652477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9a81bc1-1a65-43aa-974a-d2c976d9f0cc", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d9bc5fc-e9c9-425a-8a04-bc54fec6c97a", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27248181-b568-4555-af65-ebdf881f4689", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=556afa2d-7bec-4423-b413-45acb6ee8405", 1, 0, 0.0, 1395.0, 1395, 1395, 1395.0, 1395.0, 1395.0, 1395.0, 0.7168458781362007, 0.12950828853046595, 0.49423163082437277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 151.42105263157896, 148, 178, 149.0, 158.0, 178.0, 178.0, 0.11350263146890326, 0.0843510767068705, 0.05697300056153934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 195.89473684210526, 147, 441, 149.0, 441.0, 441.0, 441.0, 0.11350602179315618, 0.039344398179124454, 0.06423218030132861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 255.52631578947367, 146, 1313, 148.0, 441.0, 1313.0, 1313.0, 0.11350534371210266, 5.404367687492906, 0.06621533979915528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 294.42105263157896, 146, 1171, 150.0, 442.0, 1171.0, 1171.0, 0.11350534371210266, 1.7855272659250985, 0.06632618486137414], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.3834355828220859], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.15337423312883436], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07668711656441718], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.6901840490797546], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 17, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

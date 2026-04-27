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

    var data = {"OkPercent": 98.64559819413093, "KoPercent": 1.3544018058690745};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7933723196881092, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11818181818181818, 500, 1500, "see books"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=944d0f7d-176b-443e-b3d0-d25af99940ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a778b5c9-ff66-4bcb-a04d-7d0b6f5c49b7"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fd1ecd8-e411-456b-ac05-b578877a6f4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25bcd85d-40f4-4d3b-b0a4-734ce4edee6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1868dc8a-918b-480a-a850-a32cd611b4bc"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aab35a10-cc65-4201-b440-63ba3f31dd80"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25bcd85d-40f4-4d3b-b0a4-734ce4edee6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c1b4678-d2c9-4a7d-b666-c45df9703373"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2093af4f-2b55-4b36-b82c-38c7495cebc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b17a4749-a10e-49c8-b47a-ca9bdcf8898b"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=432a5bd7-4c0a-4a35-b379-100aeb1890e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3945f1d-11a0-4cf0-968e-99505027b8b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a4240c9-90fb-4f97-8ec7-8dc97c1c9a38"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83c59bc6-ff78-41d6-9cb1-152680c3553e"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83c59bc6-ff78-41d6-9cb1-152680c3553e"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a778b5c9-ff66-4bcb-a04d-7d0b6f5c49b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3046875, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fd1ecd8-e411-456b-ac05-b578877a6f4f"], "isController": false}, {"data": [0.5181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9262295081967213, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1868dc8a-918b-480a-a850-a32cd611b4bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2093af4f-2b55-4b36-b82c-38c7495cebc8"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/119e23d4-d138-437e-aa2e-7363c2128dca"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b17a4749-a10e-49c8-b47a-ca9bdcf8898b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/944d0f7d-176b-443e-b3d0-d25af99940ae"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8a4240c9-90fb-4f97-8ec7-8dc97c1c9a38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6e107b4-48e5-41b0-850a-134aedd20183"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c1b4678-d2c9-4a7d-b666-c45df9703373"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3945f1d-11a0-4cf0-968e-99505027b8b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/432a5bd7-4c0a-4a35-b379-100aeb1890e5"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 18, 1.3544018058690745, 345.7103085026338, 98, 2058, 117.0, 928.0, 1199.0, 1556.6000000000013, 5.289678559487988, 717.6553920815024, 3.8773391727762654], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1663.0545454545452, 1245, 2098, 1645.0, 1964.9999999999998, 2054.2, 2098.0, 0.24515157053010686, 295.00021294060423, 1.2054083570498906], "isController": true}, {"data": ["deleteBook", 12, 0, 0.0, 609.4166666666666, 438, 748, 609.5, 742.3000000000001, 748.0, 748.0, 0.07179094476883316, 0.012970043732650522, 0.04879540777256629], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 609.4166666666666, 438, 748, 609.5, 742.3000000000001, 748.0, 748.0, 0.07160203588455365, 0.012935914686174244, 0.048667008765282564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=944d0f7d-176b-443e-b3d0-d25af99940ae", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 162.65, 100, 306, 103.5, 305.9, 306.0, 306.0, 0.08896124403403657, 0.02380408287629494, 0.05073570948816148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 134.99999999999997, 99, 308, 105.0, 305.8, 307.9, 308.0, 0.08895966124160999, 0.06611162324693867, 0.044653579959167515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 148.6, 99, 410, 103.0, 309.6, 404.99999999999994, 410.0, 0.08896243116531888, 0.023978155275027356, 0.05238705663348368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 168.49999999999997, 100, 411, 104.0, 306.0, 405.74999999999994, 411.0, 0.08896203545137113, 0.023978048617752375, 0.05229994662277873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a778b5c9-ff66-4bcb-a04d-7d0b6f5c49b7", 3, 0, 0.0, 287.0, 198, 449, 214.0, 449.0, 449.0, 449.0, 0.01850743690506302, 0.02551399586358785, 0.011868375879874396], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 244.8461538461538, 184, 396, 212.0, 366.4, 396.0, 396.0, 0.07426195046156658, 0.18134263999805775, 0.04800919063042683], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8fd1ecd8-e411-456b-ac05-b578877a6f4f", 3, 0, 0.0, 359.3333333333333, 309, 423, 346.0, 423.0, 423.0, 423.0, 0.06458835687220117, 0.029224549496210814, 0.04141896583275921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25bcd85d-40f4-4d3b-b0a4-734ce4edee6c", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 114.94444444444443, 102, 307, 103.0, 130.60000000000028, 307.0, 307.0, 0.10557370510918081, 0.07845858358211581, 0.05299305119738177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 102.66666666666666, 100, 109, 102.0, 104.5, 109.0, 109.0, 0.10557494354673158, 0.028249545441215284, 0.06021070999149535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 694.3333333333333, 532, 816, 708.0, 816.0, 816.0, 816.0, 0.04664577972307956, 13.715408024240258, 0.02660267124831881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1078.5, 893, 1301, 1081.5, 1301.0, 1301.0, 1301.0, 0.04636820995525468, 41.72219682435722, 0.026399088285071756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 205.66666666666666, 101, 311, 205.0, 311.0, 311.0, 311.0, 0.04672642457186914, 0.0826838684806903, 0.025872932355712693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 128.25000000000003, 100, 308, 103.0, 303.8, 308.0, 308.0, 0.08465608465608465, 0.06291335978835978, 0.04249338624338624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 115.06250000000001, 99, 303, 102.0, 167.90000000000015, 303.0, 303.0, 0.08456614922754108, 0.030566451155120744, 0.04778524228201754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 240.75, 99, 1115, 108.5, 549.4000000000005, 1115.0, 1115.0, 0.08456614922754108, 4.777166751563152, 0.04926143360764478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 182.1875, 99, 776, 103.0, 447.00000000000034, 776.0, 776.0, 0.08465742842478981, 1.5771476366026973, 0.04939727879278507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 135.16666666666666, 101, 301, 102.0, 301.0, 301.0, 301.0, 0.046729699839561364, 0.03472783357217402, 0.026239821687253695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 892.8461538461538, 103, 1313, 1101.0, 1309.4, 1313.0, 1313.0, 0.06201816655217159, 42.930053869337264, 0.03236014008949698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 112.88888888888889, 99, 303, 102.0, 123.90000000000029, 303.0, 303.0, 0.10557556277640269, 0.028455913404577288, 0.062066883585346115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 663.1538461538462, 103, 928, 803.0, 919.2, 928.0, 928.0, 0.062017574826589324, 14.030954522035321, 0.032420395373965974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 135.66666666666666, 100, 303, 103.0, 300.3, 303.0, 303.0, 0.10557432432432433, 0.02845557960304054, 0.0621692554370777], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 471.0833333333333, 188, 921, 467.5, 815.4000000000003, 921.0, 921.0, 0.07176089270550526, 0.012964614404803195, 0.0494757717286003], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1868dc8a-918b-480a-a850-a32cd611b4bc", 3, 0, 0.0, 328.0, 218, 439, 327.0, 439.0, 439.0, 439.0, 0.024112072914908494, 0.0284996538912867, 0.015462494675250566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 370.56249999999994, 204, 1218, 212.5, 793.1000000000004, 1218.0, 1218.0, 0.08452058340332695, 6.442553612792719, 0.18873718654749264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 510.04761904761887, 146, 961, 553.0, 915.8000000000001, 957.1999999999999, 961.0, 0.09249715901583022, 0.05681710255952853, 0.04182244592219668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 104.92307692307692, 100, 111, 105.0, 110.2, 111.0, 111.0, 0.06207709975789931, 0.046133469644298215, 0.031159794214414303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 222.84615384615384, 100, 417, 305.0, 378.2, 417.0, 417.0, 0.06207561765239564, 0.08832905270219939, 0.031392206883708494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aab35a10-cc65-4201-b440-63ba3f31dd80", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["login", 21, 0, 0.0, 2387.095238095238, 1305, 3699, 2088.0, 3524.0, 3681.7999999999997, 3699.0, 0.09050163764868126, 31.05776819190657, 0.17942505198457162], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 128.61111111111111, 102, 310, 106.0, 308.2, 310.0, 310.0, 0.11092076559977322, 0.08979815886934767, 0.03942886589679439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25bcd85d-40f4-4d3b-b0a4-734ce4edee6c", 3, 0, 0.0, 397.0, 196, 684, 311.0, 684.0, 684.0, 684.0, 0.01872448788525634, 0.0258132181621291, 0.012007565473292639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c1b4678-d2c9-4a7d-b666-c45df9703373", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2093af4f-2b55-4b36-b82c-38c7495cebc8", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b17a4749-a10e-49c8-b47a-ca9bdcf8898b", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 999.5384615384617, 210, 1424, 1207.0, 1417.2, 1424.0, 1424.0, 0.061985933961139585, 57.065805109369414, 0.12720806264155443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=432a5bd7-4c0a-4a35-b379-100aeb1890e5", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3945f1d-11a0-4cf0-968e-99505027b8b8", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 0.19616076275787186, 0.7485918838219326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a4240c9-90fb-4f97-8ec7-8dc97c1c9a38", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 345.25000000000006, 203, 720, 309.0, 617.3000000000001, 714.8999999999999, 720.0, 0.08891892372534724, 0.13780696479699808, 0.19998074349558073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1214.3333333333333, 1104, 1403, 1190.5, 1403.0, 1403.0, 1403.0, 0.04626060138781805, 55.34376204703162, 0.10431223496530456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83c59bc6-ff78-41d6-9cb1-152680c3553e", 3, 0, 0.0, 340.6666666666667, 222, 577, 223.0, 577.0, 577.0, 577.0, 0.027456435788548835, 0.02288930079898228, 0.0176071544607556], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1047.8095238095239, 219, 2058, 1035.0, 1669.4, 2020.4999999999995, 2058.0, 0.09101586709949767, 0.028594828781817627, 0.041063799414031175], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 252.2777777777778, 205, 610, 208.0, 426.4000000000003, 610.0, 610.0, 0.10550872791643708, 0.1635179210970563, 0.23729160194487756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 112.13333333333333, 104, 126, 109.0, 124.2, 126.0, 126.0, 0.08443473757683562, 0.06555235973982844, 0.030013910623015786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83c59bc6-ff78-41d6-9cb1-152680c3553e", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 439.47058823529414, 205, 1207, 406.0, 1056.6, 1207.0, 1207.0, 0.14275997010438274, 20.28822719671904, 0.31677328614556477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 138.30769230769232, 102, 351, 104.0, 334.2, 351.0, 351.0, 0.08235979828184789, 0.061206842277818606, 0.04134075812194318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 102.69230769230771, 99, 113, 102.0, 109.8, 113.0, 113.0, 0.08236032006487459, 0.03155330771716199, 0.046439044651964294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 211.84615384615384, 101, 1096, 103.0, 783.1999999999997, 1096.0, 1096.0, 0.08236084185451274, 5.721139701806236, 0.04787471411284702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 187.46153846153845, 100, 789, 103.0, 597.7999999999998, 789.0, 789.0, 0.08236188545362393, 1.883347555277496, 0.04795575226495185], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1132.6727272727276, 803, 1654, 1018.0, 1492.2, 1624.8, 1654.0, 0.23396788259066253, 279.90692797511434, 0.4619951744124216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1047.8095238095239, 219, 2058, 1035.0, 1669.4, 2020.4999999999995, 2058.0, 0.09064891674544488, 0.028479542481967338, 0.04089824173476127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 130.28571428571428, 101, 300, 103.0, 300.0, 300.0, 300.0, 0.03715222860297006, 0.010013686615644274, 0.021877728366788033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a778b5c9-ff66-4bcb-a04d-7d0b6f5c49b7", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 131.28571428571428, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.03715143988366292, 0.010013474031143521, 0.021840983212856522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 142.73333333333332, 98, 309, 103.0, 308.4, 309.0, 309.0, 0.08320713584396998, 0.022426923332945034, 0.048916695095771415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 130.33333333333331, 100, 307, 103.0, 305.2, 307.0, 307.0, 0.0832075974083607, 0.022427047738972222, 0.04899822386449366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 116.53333333333332, 101, 299, 103.0, 185.60000000000008, 299.0, 299.0, 0.0832075974083607, 0.06183689612086181, 0.041766313542868555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 130.42857142857144, 101, 302, 101.0, 302.0, 302.0, 302.0, 0.03719150970964057, 0.009951634434024918, 0.021210782881279387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 129.8, 101, 315, 103.0, 303.0, 315.0, 315.0, 0.08320713584396998, 0.02226440939574978, 0.04745406966101413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 131.57142857142856, 101, 302, 104.0, 302.0, 302.0, 302.0, 0.03719091691549162, 0.027638952903016715, 0.018668096967346375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 106.57142857142857, 103, 109, 107.0, 109.0, 109.0, 109.0, 0.0385883286843585, 0.030373235273039992, 0.01371694496201806], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 528.4166666666666, 401, 769, 488.5, 743.5000000000001, 769.0, 769.0, 0.07196962881663937, 0.013002325518631138, 0.04898713992695083], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1226.4285714285713, 786, 1884, 1242.0, 1643.6, 1860.2999999999997, 1884.0, 0.09245602835318202, 0.047853217799986796, 0.04252616147885619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 292.57142857142856, 205, 607, 209.0, 607.0, 607.0, 607.0, 0.03713074797239594, 0.05754540725800035, 0.08350792244182408], "isController": false}, {"data": ["addBook", 64, 12, 18.75, 1007.4999999999999, 521, 1934, 848.0, 1759.0, 1900.0, 1934.0, 0.30156247055054003, 80.02112649043717, 1.099895918245943], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 185.78181818181824, 101, 421, 105.0, 413.4, 415.0, 421.0, 0.23476583175399957, 0.17446952926249382, 0.11348543624827126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fd1ecd8-e411-456b-ac05-b578877a6f4f", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 644.0909090909092, 498, 919, 605.0, 815.0, 908.6, 919.0, 0.23471173131907994, 69.01304217076346, 0.11804349768488882], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 167.79999999999998, 100, 336, 107.0, 308.4, 315.19999999999993, 336.0, 0.23491925184625173, 0.4156969573685627, 0.11424783927679041], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 945.5454545454547, 697, 1213, 909.0, 1200.2, 1207.2, 1213.0, 0.23441862051035064, 210.93028679919487, 0.11766715912335961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 106.47058823529412, 104, 115, 105.0, 110.19999999999999, 115.0, 115.0, 0.1381619583238516, 0.10321669738061182, 0.049112258622931636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 12, 6.557377049180328, 169.39344262295063, 101, 1262, 109.0, 305.6, 386.1999999999996, 689.9599999999976, 0.7583606149765861, 1.4981337219240811, 0.368435732304919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 138.00000000000003, 104, 308, 107.0, 306.0, 308.0, 308.0, 0.08374022493912729, 0.06484960778977339, 0.02976703308383041], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1868dc8a-918b-480a-a850-a32cd611b4bc", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 110.5, 102, 130, 106.5, 124.7, 129.75, 130.0, 0.08959971328091751, 0.07271226732074457, 0.03184989808032614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2093af4f-2b55-4b36-b82c-38c7495cebc8", 3, 0, 0.0, 419.33333333333337, 184, 769, 305.0, 769.0, 769.0, 769.0, 0.018046198267564966, 0.024878141166385946, 0.011572594592155918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 351.2307692307693, 206, 1199, 208.0, 982.5999999999998, 1199.0, 1199.0, 0.08230556892141717, 7.692058857978575, 0.18348725727771165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 289.06666666666666, 205, 609, 209.0, 494.4000000000001, 609.0, 609.0, 0.08315962212267707, 0.12888117217645362, 0.18702793920754424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/119e23d4-d138-437e-aa2e-7363c2128dca", 1, 0, 0.0, 803.0, 803, 803, 803.0, 803.0, 803.0, 803.0, 1.2453300124533002, 0.39767862702366125, 0.7430631226650062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b17a4749-a10e-49c8-b47a-ca9bdcf8898b", 3, 0, 0.0, 346.0, 204, 573, 261.0, 573.0, 573.0, 573.0, 0.02277523876041967, 0.031397505257284276, 0.014605214960295166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/944d0f7d-176b-443e-b3d0-d25af99940ae", 3, 0, 0.0, 382.3333333333333, 223, 611, 313.0, 611.0, 611.0, 611.0, 0.04205509217074368, 0.03442986875306652, 0.02696892303918133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a4240c9-90fb-4f97-8ec7-8dc97c1c9a38", 3, 0, 0.0, 757.0, 209, 1584, 478.0, 1584.0, 1584.0, 1584.0, 0.04817419789960497, 0.030971367464752545, 0.030892958939525324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 107.37500000000001, 102, 122, 106.5, 112.9, 122.0, 122.0, 0.08772891764447856, 0.072736182695471, 0.03118488869393574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6e107b4-48e5-41b0-850a-134aedd20183", 2, 0, 0.0, 211.0, 199, 223, 211.0, 223.0, 223.0, 223.0, 0.03533756206159337, 0.040203378712652615, 0.021965193605668145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 122.07692307692307, 102, 307, 105.0, 232.19999999999993, 307.0, 307.0, 0.06400756273972062, 0.0496933714629667, 0.022752688317635068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c1b4678-d2c9-4a7d-b666-c45df9703373", 3, 0, 0.0, 304.3333333333333, 190, 401, 322.0, 401.0, 401.0, 401.0, 0.0650110518788194, 0.030558580375330473, 0.04169003001343562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3945f1d-11a0-4cf0-968e-99505027b8b8", 3, 0, 0.0, 309.0, 212, 499, 216.0, 499.0, 499.0, 499.0, 0.019052215772694364, 0.0225190740464366, 0.012217729515692676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 134.35294117647058, 100, 310, 106.0, 305.2, 310.0, 310.0, 0.14386662717386706, 0.10691650710870393, 0.07221430309313248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 196.23529411764707, 100, 309, 104.0, 305.8, 309.0, 309.0, 0.14386906222760087, 0.06391793010502442, 0.0806288241666173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 256.47058823529414, 100, 1102, 103.0, 953.1999999999998, 1102.0, 1102.0, 0.1428859601936525, 15.159750574695737, 0.08255669735913125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/432a5bd7-4c0a-4a35-b379-100aeb1890e5", 3, 0, 0.0, 582.0, 396, 912, 438.0, 912.0, 912.0, 912.0, 0.02982463116872788, 0.024863567846065138, 0.019125821420050107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 219.05882352941177, 98, 785, 103.0, 637.7999999999998, 785.0, 785.0, 0.1432652682852833, 4.989924027270965, 0.08291576160237989], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.45146726862302483], "isController": false}, {"data": ["401/Unauthorized", 12, 66.66666666666667, 0.9029345372460497], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 18, "401/Unauthorized", 12, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

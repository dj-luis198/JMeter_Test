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

    var data = {"OkPercent": 99.40334128878281, "KoPercent": 0.5966587112171837};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6465781409601634, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/3e3dcfb1-9ff5-42af-886f-374946fc18a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86d8537b-7856-4981-9726-7afefb3f870b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.14864864864864866, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.55, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.55, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e827a59d-8b65-46cc-ad8a-5582c1406bfd"], "isController": false}, {"data": [0.2647058823529412, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/87745344-bf75-4a7c-b2d8-59a10146603c"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fef54bc-5ad2-4172-99aa-e8eca03f7529"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.18055555555555555, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8648648648648649, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a85f05b-fae8-4d95-a724-665f25fb1430"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9864864864864865, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.22972972972972974, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6330275229357798, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2107fef4-b5c4-4618-9742-3535f8fba869"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e45bdc6-0b0e-4089-8ddb-ddb50f40a383"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/99825b85-4e7d-4f4b-84c9-e75d9664690e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a85f05b-fae8-4d95-a724-665f25fb1430"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0cb32861-e9e0-4151-8607-9f161facc30a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39e79a3e-7a48-4c8a-8260-23595f2f24e3"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8fef54bc-5ad2-4172-99aa-e8eca03f7529"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0cb32861-e9e0-4151-8607-9f161facc30a"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e45bdc6-0b0e-4089-8ddb-ddb50f40a383"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99825b85-4e7d-4f4b-84c9-e75d9664690e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2107fef4-b5c4-4618-9742-3535f8fba869"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/39e79a3e-7a48-4c8a-8260-23595f2f24e3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/511e55b7-3fc5-4c61-9a38-e665289833b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e65fda9-cf60-4998-93c7-eaac97cbd6ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=511e55b7-3fc5-4c61-9a38-e665289833b2"], "isController": false}, {"data": [0.2647058823529412, 500, 1500, "register"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 838, 5, 0.5966587112171837, 2224.967780429591, 131, 41647, 345.0, 2411.2000000000016, 14589.199999999983, 35226.33000000002, 3.2455460883036404, 474.7275042663149, 2.357218392960883], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 37, 0, 0.0, 17276.405405405407, 2237, 43755, 17675.0, 33640.80000000002, 39166.80000000001, 43755.0, 0.177410383781814, 213.48428580782857, 0.8723254710365561], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 527.0666666666667, 279, 1694, 291.0, 1188.8000000000002, 1694.0, 1694.0, 0.07410188515195827, 6.017294994047148, 0.1653928990016006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 5, 0, 0.0, 9153.2, 141, 18251, 9633.0, 18251.0, 18251.0, 18251.0, 0.0394826197507857, 0.030653010451049446, 0.014034837489537105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e3dcfb1-9ff5-42af-886f-374946fc18a2", 2, 0, 0.0, 775.5, 250, 1301, 775.5, 1301.0, 1301.0, 1301.0, 0.0150681835304754, 0.021307353273562875, 0.009366112126120697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86d8537b-7856-4981-9726-7afefb3f870b", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 580.1666666666667, 280, 1694, 550.0, 1434.200000000001, 1694.0, 1694.0, 0.05938565539493935, 6.004857290393381, 0.13229353277840739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 5.270667109929079, 3.559951241134752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.6825972576530612, 1.4548788265306123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.6417410714285714, 1.3997395833333335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 1, 0, 0.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 139.0, 7.194244604316547, 1.939073741007194, 4.236454586330935], "isController": false}, {"data": ["https://demoqa.com/books", 37, 0, 0.0, 1810.216216216216, 1059, 2496, 1868.0, 2380.8, 2486.1, 2496.0, 0.17079103947119403, 204.3254597798642, 0.33724558770581475], "isController": false}, {"data": ["deleteBook", 10, 0, 0.0, 1706.6000000000004, 472, 11031, 642.0, 10045.900000000003, 11031.0, 11031.0, 0.06836625168351894, 0.012351324767041998, 0.04646768669114179], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 10, 0, 0.0, 1706.6000000000004, 472, 11031, 642.0, 10045.900000000003, 11031.0, 11031.0, 0.06865444159909925, 0.012403390327962267, 0.04666356577438777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e827a59d-8b65-46cc-ad8a-5582c1406bfd", 1, 0, 0.0, 1753.0, 1753, 1753, 1753.0, 1753.0, 1753.0, 1753.0, 0.5704506560182544, 0.1821653950370793, 0.34037631916714206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 17, 3, 17.647058823529413, 9937.647058823528, 972, 39528, 1205.0, 36923.2, 39528.0, 39528.0, 0.06595308020282512, 0.020974049402736665, 0.02975617485713399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 186.58333333333334, 134, 427, 140.0, 424.0, 427.0, 427.0, 0.05289862419494906, 0.014154514677164106, 0.03016874661118189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 137.57142857142858, 131, 141, 140.0, 141.0, 141.0, 141.0, 0.050529841480668726, 0.013619371336586491, 0.029755365637542226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 142.75, 135, 159, 142.0, 154.8, 159.0, 159.0, 0.05289419398064073, 0.03930906408131601, 0.0265504059629388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 220.00000000000003, 135, 419, 146.0, 419.0, 419.0, 419.0, 0.05053166530712424, 0.013619862914810833, 0.029707092299696092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 162.66666666666666, 134, 419, 139.5, 336.2000000000003, 419.0, 419.0, 0.05289932377031113, 0.014258020859966674, 0.031150676009275013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 139.24999999999997, 134, 143, 140.0, 142.7, 143.0, 143.0, 0.052899090576467835, 0.014257958006938597, 0.031098879420931286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 5, 0, 0.0, 276.0, 134, 556, 139.0, 556.0, 556.0, 556.0, 0.038859398922817465, 0.010473822365915644, 0.02284507631985948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 5, 0, 0.0, 138.4, 135, 141, 140.0, 141.0, 141.0, 141.0, 0.03886060700268138, 0.010474147981191466, 0.022883736350211792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 217.42857142857142, 133, 433, 142.0, 433.0, 433.0, 433.0, 0.05053239487457138, 0.013521363472297418, 0.028819256451903988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 5, 0, 0.0, 140.4, 137, 143, 140.0, 143.0, 143.0, 143.0, 0.038858794911052215, 0.028878459889951896, 0.01950529353933676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 212.42857142857144, 135, 397, 141.0, 397.0, 397.0, 397.0, 0.050529476731175964, 0.037551691203539954, 0.025363428749828564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 5, 0, 0.0, 250.6, 136, 421, 141.0, 421.0, 421.0, 421.0, 0.03877441818985507, 0.010375186117207311, 0.022113535373901715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87745344-bf75-4a7c-b2d8-59a10146603c", 1, 0, 0.0, 4752.0, 4752, 4752, 4752.0, 4752.0, 4752.0, 4752.0, 0.21043771043771042, 0.0672003235479798, 0.12556390730218855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 2949.285714285714, 141, 11570, 149.0, 11570.0, 11570.0, 11570.0, 0.046187243083460346, 0.03635441203639555, 0.016418121564823796], "isController": false}, {"data": ["deleteAccount", 8, 0, 0.0, 5359.0, 430, 38936, 514.0, 38936.0, 38936.0, 38936.0, 0.06741667720052248, 0.012179770783297518, 0.04588810938355876], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 15, 0, 0.0, 5380.0, 891, 19820, 1826.0, 16376.000000000002, 19820.0, 19820.0, 0.06458140486082707, 0.033425922437732764, 0.02970492352485308], "isController": false}, {"data": ["goToProfile", 10, 0, 0.0, 1113.6, 231, 5598, 338.5, 5219.300000000001, 5598.0, 5598.0, 0.06604452722025189, 0.11893819594420557, 0.04269675490215503], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 437.14285714285717, 276, 831, 286.0, 831.0, 831.0, 831.0, 0.05047809971588041, 0.07823119555576387, 0.11352642934147712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fef54bc-5ad2-4172-99aa-e8eca03f7529", 1, 0, 0.0, 990.0, 990, 990, 990.0, 990.0, 990.0, 990.0, 1.0101010101010102, 0.18248895202020202, 0.696417297979798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 195.8666666666667, 132, 425, 141.0, 419.6, 425.0, 425.0, 0.07415500373246851, 0.05510933382852397, 0.03722233585789924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 193.86666666666667, 132, 426, 139.0, 421.8, 426.0, 426.0, 0.07415317078958296, 0.02726673884241957, 0.04187529970239861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 967.0, 825, 1109, 967.0, 1109.0, 1109.0, 1109.0, 0.32573289902280134, 95.77628766286645, 0.18576954397394138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1512.0, 1243, 1781, 1512.0, 1781.0, 1781.0, 1781.0, 0.318775900541919, 286.8351156558814, 0.18149057618744022], "isController": false}, {"data": ["addBook", 36, 2, 5.555555555555555, 16775.916666666664, 722, 56816, 2294.0, 48439.800000000025, 54411.35, 56816.0, 0.17010820772102253, 68.52056803147002, 0.6151563902802061], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 429.5, 422, 437, 429.5, 437.0, 437.0, 437.0, 0.36677058499908305, 0.6490120117366587, 0.20308488446726572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 5, 0, 0.0, 139.4, 135, 144, 140.0, 144.0, 144.0, 144.0, 0.026726391242296116, 0.019862093491589204, 0.01341539560404317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 5, 0, 0.0, 135.6, 133, 139, 134.0, 139.0, 139.0, 139.0, 0.026727248429774156, 0.007151627021248163, 0.015242883870105573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 5, 0, 0.0, 189.2, 133, 400, 139.0, 400.0, 400.0, 400.0, 0.026689869059502394, 0.007193753769944005, 0.015690723802559026], "isController": false}, {"data": ["https://demoqa.com/books-0", 37, 0, 0.0, 327.18918918918916, 135, 581, 401.0, 563.4, 581.0, 581.0, 0.1720546110635765, 0.12786480372986497, 0.0831709301528031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 5, 0, 0.0, 142.2, 134, 149, 143.0, 149.0, 149.0, 149.0, 0.026725676961397434, 0.007203405118501651, 0.01573787422629165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a85f05b-fae8-4d95-a724-665f25fb1430", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books-3", 37, 0, 0.0, 933.5405405405406, 654, 1388, 850.0, 1244.2, 1274.6000000000001, 1388.0, 0.1715424915387825, 50.43918825919143, 0.08627381166257128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 143.5, 139, 148, 143.5, 148.0, 148.0, 148.0, 0.3861749372465727, 0.2869913351998455, 0.21684627823904226], "isController": false}, {"data": ["https://demoqa.com/books-1", 37, 0, 0.0, 247.40540540540545, 133, 574, 142.0, 420.40000000000003, 460.6000000000002, 574.0, 0.1724370954136393, 0.30513282899366645, 0.08386100929296131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 290.8, 134, 1561, 143.0, 875.8000000000004, 1561.0, 1561.0, 0.07415170450051412, 4.466776058453789, 0.04316826442992169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1021.7500000000001, 138, 1907, 1308.0, 1806.9, 1907.0, 1907.0, 0.13754921682914667, 77.36829461000498, 0.07347599766166331], "isController": false}, {"data": ["https://demoqa.com/books-2", 37, 0, 0.0, 1480.2972972972975, 918, 1959, 1526.0, 1921.0, 1948.2, 1959.0, 0.17127488693542936, 154.11344433363655, 0.08597196473126045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 4834.166666666666, 141, 29084, 147.0, 24845.000000000015, 29084.0, 29084.0, 0.05937155212080132, 0.04435472399649708, 0.021104731417941093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 279.6666666666667, 135, 1126, 145.0, 706.0000000000002, 1126.0, 1126.0, 0.07415427054444065, 1.4722422799224841, 0.04324217456162467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 703.8124999999999, 133, 1245, 817.5, 1200.2, 1245.0, 1245.0, 0.1372448104306056, 25.235453926488248, 0.07344741808200378], "isController": false}, {"data": ["deleteBooks", 8, 0, 0.0, 613.0, 227, 990, 542.5, 990.0, 990.0, 990.0, 0.06551148088702545, 0.011835570277441122, 0.04516709522093747], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 109, 2, 1.834862385321101, 6653.917431192659, 133, 41647, 274.0, 26808.0, 35022.5, 41624.9, 0.43697708075256275, 1.0073853260891352, 0.2084504702514823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 1, 0, 0.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 5.3042059075342465, 2.4347174657534247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 5, 0, 0.0, 333.0, 271, 543, 286.0, 543.0, 543.0, 543.0, 0.026669226912450262, 0.04133209288091657, 0.0599797163861064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2107fef4-b5c4-4618-9742-3535f8fba869", 3, 0, 0.0, 3892.666666666667, 231, 10966, 481.0, 10966.0, 10966.0, 10966.0, 0.014653159709672061, 0.017319538706321372, 0.009396720256527982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e45bdc6-0b0e-4089-8ddb-ddb50f40a383", 1, 0, 0.0, 904.0, 904, 904, 904.0, 904.0, 904.0, 904.0, 1.1061946902654867, 0.19984962665929204, 0.7626693860619469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 2239.083333333333, 137, 24929, 150.0, 17576.900000000027, 24929.0, 24929.0, 0.052633887451203995, 0.04271363327338918, 0.01870970217992017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99825b85-4e7d-4f4b-84c9-e75d9664690e", 3, 0, 0.0, 16443.0, 391, 38936, 10002.0, 38936.0, 38936.0, 38936.0, 0.02514964036014285, 0.016168795478932983, 0.016127861819492648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a85f05b-fae8-4d95-a724-665f25fb1430", 3, 0, 0.0, 340.0, 213, 532, 275.0, 532.0, 532.0, 532.0, 0.021631287494231658, 0.01803311434659091, 0.013871626420454546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0cb32861-e9e0-4151-8607-9f161facc30a", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39e79a3e-7a48-4c8a-8260-23595f2f24e3", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 15, 0, 0.0, 3978.5999999999995, 159, 29691, 530.0, 18982.800000000007, 29691.0, 29691.0, 0.06420875550590079, 0.039440729700401946, 0.02903188847581256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 156.625, 133, 414, 140.5, 226.4000000000002, 414.0, 414.0, 0.13756695641706862, 0.10223481819666916, 0.0690521636702864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 299.24999999999994, 134, 578, 395.0, 468.10000000000014, 578.0, 578.0, 0.13724127874561473, 0.1655539937212115, 0.07106658989732637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fef54bc-5ad2-4172-99aa-e8eca03f7529", 3, 0, 0.0, 1238.6666666666667, 430, 1811, 1475.0, 1811.0, 1811.0, 1811.0, 0.015516947092382731, 0.015562406898317447, 0.009950646410154291], "isController": false}, {"data": ["login", 15, 0, 0.0, 11766.0, 1582, 52355, 3741.0, 36313.40000000001, 52355.0, 52355.0, 0.0632649790382036, 10.180702573408464, 0.1094409998713612], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 2.757659586298932, 4.0018210631672595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 4470.0666666666675, 141, 29309, 148.0, 19253.000000000007, 29309.0, 29309.0, 0.07518985438231535, 0.06087147390912053, 0.026727643549963657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0cb32861-e9e0-4151-8607-9f161facc30a", 3, 0, 0.0, 632.3333333333334, 426, 764, 707.0, 764.0, 764.0, 764.0, 0.07411799584939223, 0.03353646296570807, 0.04753009499456468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 5, 0, 0.0, 476.0, 282, 698, 553.0, 698.0, 698.0, 698.0, 0.03873176702067502, 0.06002667408380006, 0.08710865180528767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e45bdc6-0b0e-4089-8ddb-ddb50f40a383", 3, 0, 0.0, 348.3333333333333, 263, 496, 286.0, 496.0, 496.0, 496.0, 0.034415904736775686, 0.02252942201355987, 0.0220700951599766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99825b85-4e7d-4f4b-84c9-e75d9664690e", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2107fef4-b5c4-4618-9742-3535f8fba869", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 5, 0, 0.0, 8356.0, 136, 22564, 6758.0, 22564.0, 22564.0, 22564.0, 0.027280812313467448, 0.0226185641153651, 0.009697476252052882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1197.3749999999998, 274, 2179, 1449.0, 2084.5, 2179.0, 2179.0, 0.13707901748614218, 102.57601794557105, 0.28637332827854456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 9060.75, 137, 29279, 991.0, 28779.9, 29279.0, 29279.0, 0.1270395807693835, 0.09862936202310534, 0.04515860097661678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39e79a3e-7a48-4c8a-8260-23595f2f24e3", 3, 0, 0.0, 954.6666666666666, 473, 1623, 768.0, 1623.0, 1623.0, 1623.0, 0.014250021375032063, 0.014291769484529227, 0.009138197301045951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 331.0833333333333, 272, 570, 283.5, 567.6, 570.0, 570.0, 0.052861340299283285, 0.0819247529833619, 0.11888639327075139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1655.5, 1382, 1929, 1655.5, 1929.0, 1929.0, 1929.0, 0.3114294612270321, 372.57790602616006, 0.7022369394269699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/511e55b7-3fc5-4c61-9a38-e665289833b2", 3, 0, 0.0, 2101.0, 240, 5598, 465.0, 5598.0, 5598.0, 5598.0, 0.03026115375692224, 0.013692384024128227, 0.01940575289750547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e65fda9-cf60-4998-93c7-eaac97cbd6ec", 2, 0, 0.0, 323.0, 245, 401, 323.0, 401.0, 401.0, 401.0, 0.06922810661128419, 0.03971827405676705, 0.04303094712703358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 186.25, 132, 414, 142.0, 408.3, 414.0, 414.0, 0.059841121821563745, 0.044471771197470714, 0.030037438101839616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 273.6666666666667, 131, 417, 272.0, 416.4, 417.0, 417.0, 0.05976214665630789, 0.023471038392199047, 0.03366484205362657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 347.4166666666667, 138, 1538, 143.0, 1201.4000000000012, 1538.0, 1538.0, 0.05942977134395475, 4.470934392318207, 0.03451260158776539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=511e55b7-3fc5-4c61-9a38-e665289833b2", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["register", 17, 3, 17.647058823529413, 9937.647058823528, 972, 39528, 1205.0, 36923.2, 39528.0, 39528.0, 0.06675069401089213, 0.0212277023233168, 0.03011603577444548], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 253.91666666666669, 131, 980, 140.5, 810.8000000000006, 980.0, 980.0, 0.05959445970172973, 1.4749531779987188, 0.034666438635088226], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 60.0, 0.35799522673031026], "isController": false}, {"data": ["401/Unauthorized", 2, 40.0, 0.2386634844868735], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 838, 5, "406/Not Acceptable", 3, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 17, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 109, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

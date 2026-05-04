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

    var data = {"OkPercent": 98.63429438543247, "KoPercent": 1.3657056145675266};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7782834850455137, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03571428571428571, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dee1e034-287d-4d37-933e-62619be33311"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2e66258-9aba-49fb-b576-9d0042bacdbf"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee68e7b2-f90e-4491-9238-8ca34edf07af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cdbe1704-4739-448d-b869-1ea1d1d26ecb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d1daf65-0260-4599-a7ab-c7aec5942d2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31b91532-9ef9-4661-bc4c-7f320c1ecb8e"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c8ee4663-9c45-4a93-b2f9-8f44c9dd5484"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fb6a7e2-3d09-4fc9-823c-68016a421a3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb40af4a-3ef9-408d-8ec2-c6216a94b65a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8216ff2c-2d8f-4ade-b1f5-be46c7ec35de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dcbc67b2-852e-46ab-b6c5-07b41bfb29e9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c7c0534-faac-4d3f-876b-e2286801989e"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d1daf65-0260-4599-a7ab-c7aec5942d2b"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c7c0534-faac-4d3f-876b-e2286801989e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8216ff2c-2d8f-4ade-b1f5-be46c7ec35de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42cc5952-f5e9-480e-b86d-cfdfcafa4d95"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8ee4663-9c45-4a93-b2f9-8f44c9dd5484"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2e66258-9aba-49fb-b576-9d0042bacdbf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dee1e034-287d-4d37-933e-62619be33311"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee68e7b2-f90e-4491-9238-8ca34edf07af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdbe1704-4739-448d-b869-1ea1d1d26ecb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/31b91532-9ef9-4661-bc4c-7f320c1ecb8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/894b3999-9524-4f83-85e2-2d69ba303e2f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb40af4a-3ef9-408d-8ec2-c6216a94b65a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5d11d003-bd8d-48e9-94f3-d32a06ca2209"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcbc67b2-852e-46ab-b6c5-07b41bfb29e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a23301d-5a31-4ad8-9617-8f417f890fa9"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42cc5952-f5e9-480e-b86d-cfdfcafa4d95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fb6a7e2-3d09-4fc9-823c-68016a421a3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1318, 18, 1.3657056145675266, 393.27921092564526, 110, 2157, 133.0, 1107.0, 1356.05, 1767.2899999999995, 5.117154892939646, 709.2991468779726, 3.7395331336264634], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1874.3571428571427, 1373, 2692, 1837.5, 2287.8, 2359.0499999999997, 2692.0, 0.25379905459852165, 305.4049479343703, 1.247927968655817], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dee1e034-287d-4d37-933e-62619be33311", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2e66258-9aba-49fb-b576-9d0042bacdbf", 3, 0, 0.0, 392.6666666666667, 320, 447, 411.0, 447.0, 447.0, 447.0, 0.018165084285991086, 0.025042035140355554, 0.011648833347461734], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 531.3333333333334, 118, 932, 517.0, 864.2, 932.0, 932.0, 0.084809010109234, 0.016613952566320648, 0.0571025249055793], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 531.3333333333334, 118, 932, 517.0, 864.2, 932.0, 932.0, 0.08224360555966774, 0.016111393823505224, 0.0553752193162815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 194.76470588235293, 112, 347, 116.0, 343.8, 347.0, 347.0, 0.08023636689730688, 0.03564729214061187, 0.04496702639304492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 142.76470588235293, 112, 341, 116.0, 337.8, 341.0, 341.0, 0.08032545986325772, 0.0596949950741593, 0.04031961559542428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 193.2941176470588, 113, 905, 114.0, 718.5999999999998, 905.0, 905.0, 0.08032545986325772, 2.7977328138953594, 0.046488913609967916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 308.0588235294117, 111, 1362, 115.0, 1266.8, 1362.0, 1362.0, 0.08023674559759857, 8.512866124399995, 0.04635921342030368], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 256.1333333333334, 114, 447, 235.0, 441.0, 447.0, 447.0, 0.08466301298730619, 0.18192075153945578, 0.05472229120689947], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee68e7b2-f90e-4491-9238-8ca34edf07af", 1, 0, 0.0, 888.0, 888, 888, 888.0, 888.0, 888.0, 888.0, 1.1261261261261262, 0.20345052083333334, 0.7764111768018018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdbe1704-4739-448d-b869-1ea1d1d26ecb", 3, 0, 0.0, 285.0, 206, 437, 212.0, 437.0, 437.0, 437.0, 0.030644452843294485, 0.025547019443905326, 0.019651553418388715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 116.23076923076921, 114, 119, 116.0, 119.0, 119.0, 119.0, 0.12336892052194542, 0.09168334816132859, 0.06192541518386714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 116.23076923076923, 113, 124, 115.0, 123.6, 124.0, 124.0, 0.12337126208801118, 0.04726513195979995, 0.06956315303730556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 744.0, 569, 968, 672.0, 968.0, 968.0, 968.0, 0.0354461608263209, 10.422348206247031, 0.02021538859626114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1149.8, 792, 1359, 1236.0, 1359.0, 1359.0, 1359.0, 0.03543435431519566, 31.88389429976401, 0.020174051333749096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 264.2, 116, 398, 342.0, 398.0, 398.0, 398.0, 0.035589975015837536, 0.06297757297724377, 0.01970655843162098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 131.0666666666667, 112, 347, 116.0, 209.60000000000008, 347.0, 347.0, 0.07542008990074715, 0.05604950040475448, 0.03785734981346098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 169.26666666666665, 112, 457, 116.0, 388.6, 457.0, 457.0, 0.07542160678191089, 0.020181172127190998, 0.04301388511780855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 161.73333333333335, 110, 360, 115.0, 350.4, 360.0, 360.0, 0.07542160678191089, 0.020328479952936917, 0.04433965554952182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 176.8, 111, 348, 116.0, 344.4, 348.0, 348.0, 0.0754212275558997, 0.02032837773967609, 0.04441308614864015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d1daf65-0260-4599-a7ab-c7aec5942d2b", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.23740349868593955, 0.9059830814717477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 115.4, 114, 118, 115.0, 118.0, 118.0, 118.0, 0.03566181190533929, 0.02650257701168281, 0.020024943208564544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31b91532-9ef9-4661-bc4c-7f320c1ecb8e", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 744.7894736842105, 112, 1477, 984.0, 1396.0, 1477.0, 1477.0, 0.09097743280837758, 43.09669636700775, 0.04936984660726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 227.07692307692307, 114, 1341, 115.0, 940.9999999999997, 1341.0, 1341.0, 0.12337009129386754, 8.569819242056864, 0.07171257259855372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 514.7894736842105, 114, 1034, 666.0, 1032.0, 1034.0, 1034.0, 0.09107380813145306, 14.105692652261027, 0.049511084940706156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 228.53846153846158, 115, 885, 117.0, 669.3999999999999, 885.0, 885.0, 0.12337126208801118, 2.821098176240593, 0.07183373290596262], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 567.0, 117, 1440, 486.0, 1108.8000000000002, 1440.0, 1440.0, 0.08182948916577563, 0.016030269068998626, 0.055639790680166716], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c8ee4663-9c45-4a93-b2f9-8f44c9dd5484", 3, 0, 0.0, 576.6666666666666, 302, 908, 520.0, 908.0, 908.0, 908.0, 0.022999080036798528, 0.02731889422339773, 0.014748759007973015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 347.8, 228, 691, 237.0, 620.2, 691.0, 691.0, 0.07537612687309675, 0.11681827475352007, 0.16952267596556816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 621.7619047619047, 164, 1404, 533.0, 1161.2, 1381.2999999999997, 1404.0, 0.08900152997868202, 0.05466988511385839, 0.04024190271497048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 139.31578947368422, 113, 345, 115.0, 345.0, 345.0, 345.0, 0.0910733715841494, 0.06768245681204853, 0.045714563470949994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 252.78947368421052, 112, 463, 338.0, 350.0, 463.0, 463.0, 0.09097525473071325, 0.09625907657722362, 0.04786300922201792], "isController": false}, {"data": ["login", 21, 0, 0.0, 2825.0000000000005, 1748, 4096, 2926.0, 3805.6000000000004, 4070.9999999999995, 4096.0, 0.08862554441405854, 25.3663873313477, 0.16870752699913907], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 153.92307692307693, 116, 342, 120.0, 342.0, 342.0, 342.0, 0.11911197441841288, 0.09642951835240651, 0.0423405846565452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fb6a7e2-3d09-4fc9-823c-68016a421a3e", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb40af4a-3ef9-408d-8ec2-c6216a94b65a", 3, 0, 0.0, 314.0, 230, 471, 241.0, 471.0, 471.0, 471.0, 0.022791157031071946, 0.03140461188558839, 0.014615422965889236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8216ff2c-2d8f-4ade-b1f5-be46c7ec35de", 3, 0, 0.0, 480.6666666666667, 290, 695, 457.0, 695.0, 695.0, 695.0, 0.018290898448931812, 0.02521548012084187, 0.011729514955857966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcbc67b2-852e-46ab-b6c5-07b41bfb29e9", 3, 0, 0.0, 350.0, 200, 450, 400.0, 450.0, 450.0, 450.0, 0.036198658236401365, 0.02327224935445726, 0.02321333226748395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c7c0534-faac-4d3f-876b-e2286801989e", 3, 0, 0.0, 621.0, 223, 1184, 456.0, 1184.0, 1184.0, 1184.0, 0.019383726715298283, 0.026722032109143302, 0.012430319540734902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 886.6842105263158, 231, 1594, 1099.0, 1510.0, 1594.0, 1594.0, 0.09092431746943269, 57.31785133724547, 0.19224679521690236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 478.9411764705883, 228, 1699, 249.0, 1427.7999999999997, 1699.0, 1699.0, 0.08019359677716086, 11.396653487301108, 0.17794336297744673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 754.4444444444445, 114, 1474, 908.0, 1474.0, 1474.0, 1474.0, 0.06372944725326082, 42.364564966860684, 0.09860223398266559], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 963.1249999999998, 217, 1668, 1068.5, 1517.5, 1646.0, 1668.0, 0.09647892136565914, 0.03029098947173771, 0.04352857585052199], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 397.23076923076917, 231, 1456, 235.0, 1058.7999999999997, 1456.0, 1456.0, 0.12323326160525544, 11.517051810107024, 0.2747290793764397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 122.05555555555554, 117, 147, 120.5, 127.20000000000003, 147.0, 147.0, 0.11092760125224936, 0.08612054980033032, 0.039431295757635515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d1daf65-0260-4599-a7ab-c7aec5942d2b", 3, 0, 0.0, 385.0, 340, 446, 369.0, 446.0, 446.0, 446.0, 0.06561679790026247, 0.04218527859798775, 0.04207848042432196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 401.9, 229, 1361, 238.5, 685.0, 1327.1999999999994, 1361.0, 0.1621928472954343, 9.94075050938691, 0.36270058693536616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c7c0534-faac-4d3f-876b-e2286801989e", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 145.75, 115, 341, 117.0, 341.0, 341.0, 341.0, 0.04271655960828915, 0.03174541197451957, 0.021441710584629514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 114.74999999999999, 113, 116, 115.0, 116.0, 116.0, 116.0, 0.04271906872430181, 0.01945094315693918, 0.023914752095904306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 254.125, 113, 1229, 115.0, 1229.0, 1229.0, 1229.0, 0.042466000658223015, 4.786387929901903, 0.02450918592676738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 215.375, 114, 918, 115.0, 918.0, 918.0, 918.0, 0.04253644841923923, 1.5734228116326552, 0.024591384242372682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 118.0, 117, 119, 118.0, 119.0, 119.0, 119.0, 0.021731335499223105, 0.006409046211684939, 0.01343353063575022], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1272.5714285714291, 903, 2157, 1144.0, 1819.6, 1879.8999999999999, 2157.0, 0.2633410454639505, 315.0474425352219, 0.5199956971954179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 963.1249999999998, 217, 1668, 1068.5, 1517.5, 1646.0, 1668.0, 0.09497202282494283, 0.029817876306854608, 0.04284870561047225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 114.5, 112, 116, 115.0, 116.0, 116.0, 116.0, 0.037003003410443484, 0.009973465762971095, 0.021789854547360762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 190.0, 112, 347, 114.0, 347.0, 347.0, 347.0, 0.03694945314809341, 0.009959032293822053, 0.021722237104640853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 177.16666666666666, 112, 344, 115.0, 343.1, 344.0, 344.0, 0.11320683517713724, 0.030512779793837774, 0.0665532370865592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 152.11111111111111, 113, 343, 115.0, 339.4, 343.0, 343.0, 0.11304615423263643, 0.030469471258015284, 0.06656917090066383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 154.7222222222222, 114, 344, 117.0, 338.6, 344.0, 344.0, 0.11320256340915809, 0.08412807690856378, 0.056822380461237554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 190.33333333333334, 113, 345, 114.5, 345.0, 345.0, 345.0, 0.0369499082410612, 0.009886987166065203, 0.021072994543730215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 190.0, 111, 351, 116.0, 343.8, 351.0, 351.0, 0.11304686420559457, 0.030248867961262606, 0.06447203974225316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 115.33333333333333, 114, 117, 115.0, 117.0, 117.0, 117.0, 0.03700231881197888, 0.0274987935702304, 0.01857342955991909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8216ff2c-2d8f-4ade-b1f5-be46c7ec35de", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 121.66666666666666, 117, 127, 121.0, 127.0, 127.0, 127.0, 0.034728854468735346, 0.02733540693535224, 0.012345022486933269], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 453.57142857142867, 115, 863, 448.0, 779.0, 863.0, 863.0, 0.08345056150306382, 0.016112664218783528, 0.05679015611215755], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42cc5952-f5e9-480e-b86d-cfdfcafa4d95", 1, 0, 0.0, 1440.0, 1440, 1440, 1440.0, 1440.0, 1440.0, 1440.0, 0.6944444444444444, 0.1254611545138889, 0.4787868923611111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1502.0000000000002, 1026, 1925, 1488.0, 1860.6, 1918.8, 1925.0, 0.08664545915904392, 0.04484579429130203, 0.03985352662491181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 307.3333333333333, 230, 462, 232.0, 462.0, 462.0, 462.0, 0.03692307692307692, 0.05722355769230769, 0.08304086538461539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8ee4663-9c45-4a93-b2f9-8f44c9dd5484", 1, 0, 0.0, 753.0, 753, 753, 753.0, 753.0, 753.0, 753.0, 1.3280212483399734, 0.23992571381142097, 0.9156083997343958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2e66258-9aba-49fb-b576-9d0042bacdbf", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dee1e034-287d-4d37-933e-62619be33311", 3, 0, 0.0, 358.0, 218, 519, 337.0, 519.0, 519.0, 519.0, 0.018757737566746282, 0.02217101077632023, 0.012028887697425187], "isController": false}, {"data": ["addBook", 60, 3, 5.0, 1166.3666666666663, 592, 2623, 925.5, 2033.4, 2279.9999999999995, 2623.0, 0.28836865048277716, 87.30857935034147, 1.0505977716913302], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 207.85714285714278, 113, 493, 117.0, 463.6, 469.05, 493.0, 0.26459526374477893, 0.1966376911228289, 0.12790493706412656], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 730.9285714285716, 552, 1107, 682.0, 914.0, 935.1999999999998, 1107.0, 0.2645177746497501, 77.77700856376296, 0.13303384174279426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee68e7b2-f90e-4491-9238-8ca34edf07af", 3, 0, 0.0, 467.0, 242, 863, 296.0, 863.0, 863.0, 863.0, 0.018789340181003977, 0.022208363996492658, 0.012049153696802681], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 180.7857142857143, 113, 468, 119.0, 344.3, 346.15, 468.0, 0.2650824832548342, 0.46907173794703083, 0.12891706705166742], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1061.3214285714287, 782, 1663, 1017.0, 1358.3, 1379.9999999999998, 1663.0, 0.26397786357058345, 237.52774566439928, 0.132504513550078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 118.00000000000001, 115, 125, 117.0, 123.60000000000001, 124.95, 125.0, 0.16499880375867276, 0.12326570788611783, 0.05865191852359071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 3, 1.7045454545454546, 186.8522727272727, 114, 2146, 121.0, 308.6, 410.45000000000005, 1050.2899999999854, 0.7709627397212269, 1.5952097916648416, 0.37271212837186685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 149.0, 116, 349, 120.5, 349.0, 349.0, 349.0, 0.043001505052676844, 0.033300970221457754, 0.015285691249193722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdbe1704-4739-448d-b869-1ea1d1d26ecb", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31b91532-9ef9-4661-bc4c-7f320c1ecb8e", 3, 0, 0.0, 875.6666666666666, 421, 1769, 437.0, 1769.0, 1769.0, 1769.0, 0.04796623177283193, 0.03083766528364032, 0.03075959524494756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/894b3999-9524-4f83-85e2-2d69ba303e2f", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.7513786764705882, 1.403952205882353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb40af4a-3ef9-408d-8ec2-c6216a94b65a", 1, 0, 0.0, 664.0, 664, 664, 664.0, 664.0, 664.0, 664.0, 1.5060240963855422, 0.2720844314759036, 1.0383330195783131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 120.88235294117646, 116, 133, 119.0, 129.8, 133.0, 133.0, 0.08151131568853089, 0.06614834310270426, 0.02897472549865746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 401.25, 231, 1571, 233.0, 1571.0, 1571.0, 1571.0, 0.04243784182355406, 6.403850645651978, 0.09408643593742541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d11d003-bd8d-48e9-94f3-d32a06ca2209", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.5702427455357142, 1.0654994419642856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcbc67b2-852e-46ab-b6c5-07b41bfb29e9", 1, 0, 0.0, 754.0, 754, 754, 754.0, 754.0, 754.0, 754.0, 1.3262599469496021, 0.2396075099469496, 0.9143940649867374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a23301d-5a31-4ad8-9617-8f417f890fa9", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.1364268238434163, 2.123415258007117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 383.7777777777777, 229, 687, 343.5, 682.5, 687.0, 687.0, 0.11296102217173841, 0.1750675216665516, 0.2540519863881968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42cc5952-f5e9-480e-b86d-cfdfcafa4d95", 2, 0, 0.0, 310.5, 235, 386, 310.5, 386.0, 386.0, 386.0, 0.09946290033817387, 0.05842474077481599, 0.06182435162621842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fb6a7e2-3d09-4fc9-823c-68016a421a3e", 3, 0, 0.0, 308.0, 243, 431, 250.0, 431.0, 431.0, 431.0, 0.09896091044037604, 0.04477723486722744, 0.06346126092693385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 155.1333333333333, 115, 353, 123.0, 348.8, 353.0, 353.0, 0.07575834099334337, 0.06281135888998879, 0.026929722774977526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 134.9473684210526, 116, 356, 120.0, 138.0, 356.0, 356.0, 0.08988338813066206, 0.069782513245973, 0.031950735624571285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 138.80000000000004, 113, 344, 116.0, 321.80000000000047, 344.0, 344.0, 0.16234688659258237, 0.1206503717743703, 0.08149052705916733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 194.35, 113, 352, 115.5, 342.9, 351.55, 352.0, 0.16234952228653068, 0.05563324938510118, 0.09190822077099788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 239.40000000000003, 110, 1245, 116.0, 351.1, 1200.3499999999995, 1245.0, 0.16234556877770023, 7.345510751842622, 0.09474385927886098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 176.85, 112, 913, 114.0, 340.0, 884.3499999999996, 913.0, 0.16234688659258237, 2.428338435422467, 0.09490317022882794], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.5311077389984825], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.15174506828528073], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.11111111111111, 0.15174506828528073], "isController": false}, {"data": ["401/Unauthorized", 7, 38.888888888888886, 0.5311077389984825], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1318, 18, "406/Not Acceptable", 7, "401/Unauthorized", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

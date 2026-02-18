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

    var data = {"OkPercent": 68.68217054263566, "KoPercent": 31.31782945736434};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5182648401826484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc04bea7-9f6b-4ac9-83da-317a2f329f9f"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2e20770-d953-4e5c-884d-fa9958d7b566"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7cba1dea-804b-4c65-9e9a-4fc6a99e08d9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eeb1fd6b-e0fe-4b8c-893c-7e2cc6f6a369"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19f1f011-4e7e-4411-b2e4-79bc2c5cec23"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ee70245-47bf-48c3-a9b7-536383869ffc"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/712a4bf8-6421-4a08-a24c-e26b04eaec1b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc04bea7-9f6b-4ac9-83da-317a2f329f9f"], "isController": false}, {"data": [0.38, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eeb1fd6b-e0fe-4b8c-893c-7e2cc6f6a369"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1018f70e-271a-4278-94e1-774dc9bd6133"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b1a6d4a4-5584-42f8-abd0-9e0b58355a93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e2ed908-c6cc-4302-9c4c-5eabdb0f4921"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0cfa7db-34be-4cb8-993e-9efc18e81781"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9fbcb612-cbd9-476c-9bec-6ee389099c81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1a6d4a4-5584-42f8-abd0-9e0b58355a93"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fbcb612-cbd9-476c-9bec-6ee389099c81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9617486338797814, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98c0f3a9-3377-4b6f-84a6-ab014d07739d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ad3a1fa-8170-455e-b622-f58800b26721"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0142d5a4-fa60-4058-8ba7-c924734dec53"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0cfa7db-34be-4cb8-993e-9efc18e81781"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53da2829-8e53-41bd-8079-3e5166453b2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0142d5a4-fa60-4058-8ba7-c924734dec53"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53da2829-8e53-41bd-8079-3e5166453b2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ee70245-47bf-48c3-a9b7-536383869ffc"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19f1f011-4e7e-4411-b2e4-79bc2c5cec23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eceec6e9-0516-472a-97d8-7e3d52dc172a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b168142-b166-4b3e-9a6a-91e6da1ce52f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80836121-7e0d-42d0-966d-1a842837fb1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed4b9262-89f6-4573-95e3-e31f31aacff0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2e20770-d953-4e5c-884d-fa9958d7b566"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cba1dea-804b-4c65-9e9a-4fc6a99e08d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d42fc68d-cdd7-468a-8ba9-5d76d0fdb5b2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/80836121-7e0d-42d0-966d-1a842837fb1c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b168142-b166-4b3e-9a6a-91e6da1ce52f"], "isController": false}, {"data": [0.38, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 645, 202, 31.31782945736434, 265.2387596899221, 80, 3331, 88.0, 655.3999999999993, 1031.499999999999, 2115.16, 2.5058859180866686, 2.6364349559915925, 1.2001375444843314], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/bc04bea7-9f6b-4ac9-83da-317a2f329f9f", 3, 0, 0.0, 304.0, 186, 394, 332.0, 394.0, 394.0, 394.0, 0.01879145865565905, 0.02590554277562372, 0.012050512223843856], "isController": false}, {"data": ["see books", 61, 61, 100.0, 461.0819672131148, 328, 793, 492.0, 613.4000000000001, 640.3, 793.0, 0.2720602992663292, 1.751318488950338, 0.45671060003791003], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 112.6842105263158, 82, 262, 87.0, 248.0, 262.0, 262.0, 0.0858217887970947, 0.06662922079461943, 0.030506963986467257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, 100.0, 98.94999999999999, 81, 245, 83.0, 224.60000000000034, 244.75, 245.0, 0.1001091189396442, 0.049761271035428614, 0.0502500850927511], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2e20770-d953-4e5c-884d-fa9958d7b566", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cba1dea-804b-4c65-9e9a-4fc6a99e08d9", 3, 0, 0.0, 284.6666666666667, 170, 507, 177.0, 507.0, 507.0, 507.0, 0.07699217246246631, 0.0348369530347748, 0.04937323559604773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 10, 10, 100.0, 98.4, 81, 242, 83.0, 226.20000000000005, 242.0, 242.0, 0.07663833602844816, 0.03809464163914073, 0.03846885226427964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eeb1fd6b-e0fe-4b8c-893c-7e2cc6f6a369", 3, 0, 0.0, 239.33333333333334, 169, 367, 182.0, 367.0, 367.0, 367.0, 0.041637751561415685, 0.027257004684247053, 0.02670129250520472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19f1f011-4e7e-4411-b2e4-79bc2c5cec23", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ee70245-47bf-48c3-a9b7-536383869ffc", 3, 0, 0.0, 641.0, 272, 1292, 359.0, 1292.0, 1292.0, 1292.0, 0.05846927439630474, 0.03759010967861389, 0.03749494484398449], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 85.5, 82, 89, 85.5, 89.0, 89.0, 89.0, 0.03717472118959108, 0.010963638475836432, 0.022980076672862455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/712a4bf8-6421-4a08-a24c-e26b04eaec1b", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/books", 61, 61, 100.0, 158.5901639344262, 80, 530, 84.0, 332.0, 372.4, 530.0, 0.27243210411372476, 0.1354179111268417, 0.13169325345341187], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 538.9333333333333, 83, 1065, 430.0, 1026.0, 1065.0, 1065.0, 0.09061856230630282, 0.01775203476430112, 0.06101413876118384], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 538.9333333333333, 83, 1065, 430.0, 1026.0, 1065.0, 1065.0, 0.08921826952244434, 0.017477719595900717, 0.06007131141934371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc04bea7-9f6b-4ac9-83da-317a2f329f9f", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 3, 12.0, 988.84, 135, 2864, 877.0, 1774.0000000000002, 2546.899999999999, 2864.0, 0.09732966335616039, 0.031145492273971325, 0.043912406709517675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eeb1fd6b-e0fe-4b8c-893c-7e2cc6f6a369", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.5376906622023809, 2.051943824404762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1018f70e-271a-4278-94e1-774dc9bd6133", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.6517059948979592, 1.2177136479591837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1a6d4a4-5584-42f8-abd0-9e0b58355a93", 3, 0, 0.0, 1334.6666666666667, 283, 3331, 390.0, 3331.0, 3331.0, 3331.0, 0.02638313589953302, 0.031183973454168096, 0.016918872956406265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 100.3, 82, 246, 84.0, 230.20000000000005, 246.0, 246.0, 0.05121638924455826, 0.04031290012804097, 0.01820582586427657], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 417.06666666666666, 83, 1060, 404.0, 751.0000000000002, 1060.0, 1060.0, 0.0883569148121532, 0.019690476523567736, 0.0591404584104002], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1368.041666666667, 864, 2807, 1137.5, 2428.0, 2790.0, 2807.0, 0.1063504513247278, 0.05504466718955638, 0.048917053294869915], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 324.3333333333333, 81, 2113, 179.0, 1032.4000000000005, 2113.0, 2113.0, 0.09116268893467282, 0.17191526352094616, 0.057902551643663286], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8e2ed908-c6cc-4302-9c4c-5eabdb0f4921", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 2.0211135284810124, 3.7764537183544302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, 100.0, 84.8, 81, 94, 83.5, 93.8, 94.0, 94.0, 0.05213275083673065, 0.02591364274989834, 0.026168197197343313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0cfa7db-34be-4cb8-993e-9efc18e81781", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.5491308890577508, 2.0956022036474162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fbcb612-cbd9-476c-9bec-6ee389099c81", 3, 0, 0.0, 300.6666666666667, 167, 432, 303.0, 432.0, 432.0, 432.0, 0.03371771528761211, 0.027406619489963358, 0.021622362993683548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1a6d4a4-5584-42f8-abd0-9e0b58355a93", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 589.2622950819673, 329, 2338, 559.0, 744.0000000000001, 927.5, 2338.0, 0.27893875236640664, 0.9377029165104305, 0.5453291905974776], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fbcb612-cbd9-476c-9bec-6ee389099c81", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 10, 0, 0.0, 86.6, 81, 109, 84.5, 106.80000000000001, 109.0, 109.0, 0.07863984523678458, 0.058749493755996286, 0.027954007486513267], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 347.4666666666667, 82, 643, 349.0, 595.0, 643.0, 643.0, 0.08939959233785894, 0.01751324045212354, 0.06078706656097648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 5, 2.73224043715847, 166.99453551912566, 81, 2085, 89.0, 320.19999999999993, 395.59999999999957, 1037.5199999999957, 0.7630977599119311, 1.7106784103276733, 0.36513791271913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 118.1, 82, 256, 85.0, 254.8, 256.0, 256.0, 0.05208468970546108, 0.04033511614885804, 0.018514479543738117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98c0f3a9-3377-4b6f-84a6-ab014d07739d", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ad3a1fa-8170-455e-b622-f58800b26721", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.8821434737569062, 1.648286429558011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, 100.0, 92.52941176470588, 80, 241, 82.0, 128.9999999999999, 241.0, 241.0, 0.0769833398995594, 0.038266132821167705, 0.03864202803552102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 87.53846153846155, 82, 101, 84.0, 99.0, 101.0, 101.0, 0.09910651663464765, 0.08042726105800019, 0.035229269584972404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 532.1666666666667, 88, 1252, 453.5, 943.5, 1176.0, 1252.0, 0.10560173186840265, 0.06486668881369655, 0.04774765806159221], "isController": false}, {"data": ["login", 24, 3, 12.5, 2411.2499999999995, 1372, 5877, 1936.5, 4742.5, 5712.0, 5877.0, 0.10281410780915988, 0.15148514175495115, 0.15467298152344802], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, 100.0, 82.6, 81, 84, 82.5, 84.0, 84.0, 84.0, 0.0501811539658166, 0.024943561883399072, 0.025188587049247785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 93.35, 82, 242, 85.0, 93.80000000000001, 234.5999999999999, 242.0, 0.10119306625110047, 0.08192290226773662, 0.03597097276894587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 19, 100.0, 100.0, 81, 244, 83.0, 241.0, 244.0, 244.0, 0.08574587630029108, 0.04262172952817203, 0.043040410564794546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0142d5a4-fa60-4058-8ba7-c924734dec53", 3, 0, 0.0, 892.0, 191, 2113, 372.0, 2113.0, 2113.0, 2113.0, 0.08184868905683028, 0.03794027773988487, 0.052487603333969936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0cfa7db-34be-4cb8-993e-9efc18e81781", 3, 0, 0.0, 500.0, 178, 860, 462.0, 860.0, 860.0, 860.0, 0.04374708352776482, 0.028125159494575364, 0.02805395655914606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53da2829-8e53-41bd-8079-3e5166453b2c", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.2809705482115085, 1.072244362363919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0142d5a4-fa60-4058-8ba7-c924734dec53", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.0627297794117647, 4.055606617647059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53da2829-8e53-41bd-8079-3e5166453b2c", 3, 0, 0.0, 534.3333333333333, 231, 1060, 312.0, 1060.0, 1060.0, 1060.0, 0.020388745412532282, 0.028107531517602286, 0.013074813952698112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 86.70588235294117, 82, 98, 84.0, 96.4, 98.0, 98.0, 0.07739726651065805, 0.06417019459721553, 0.027512309579960485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ee70245-47bf-48c3-a9b7-536383869ffc", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 23, 100.0, 103.6086956521739, 81, 241, 83.0, 240.0, 240.8, 241.0, 0.10810556743672299, 0.05373606818876172, 0.054263927404761346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19f1f011-4e7e-4411-b2e4-79bc2c5cec23", 3, 0, 0.0, 294.0, 179, 415, 288.0, 415.0, 415.0, 415.0, 0.041818840781733535, 0.02688548520310017, 0.02681742068359865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eceec6e9-0516-472a-97d8-7e3d52dc172a", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b168142-b166-4b3e-9a6a-91e6da1ce52f", 3, 0, 0.0, 245.0, 164, 404, 167.0, 404.0, 404.0, 404.0, 0.01896297794605665, 0.026141995964046195, 0.012160503435459505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80836121-7e0d-42d0-966d-1a842837fb1c", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 1.115210262345679, 4.255883487654321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 98.34782608695652, 82, 365, 86.0, 92.6, 310.5999999999992, 365.0, 0.10773338329664153, 0.08364066378987306, 0.038295851093728045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed4b9262-89f6-4573-95e3-e31f31aacff0", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2e20770-d953-4e5c-884d-fa9958d7b566", 3, 0, 0.0, 307.3333333333333, 202, 443, 277.0, 443.0, 443.0, 443.0, 0.020363419153832055, 0.024068872053243553, 0.013058572829768604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 13, 100.0, 108.61538461538461, 81, 251, 83.0, 246.6, 251.0, 251.0, 0.09729373727697282, 0.048361828392557774, 0.04883689546910549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 106.00000000000001, 81, 245, 83.0, 245.0, 245.0, 245.0, 0.08335020182656014, 0.041430910868866314, 0.047617058660681326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cba1dea-804b-4c65-9e9a-4fc6a99e08d9", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d42fc68d-cdd7-468a-8ba9-5d76d0fdb5b2", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.8895617603550294, 3.5306490384615383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80836121-7e0d-42d0-966d-1a842837fb1c", 3, 0, 0.0, 957.6666666666666, 163, 2165, 545.0, 2165.0, 2165.0, 2165.0, 0.0720530310308387, 0.03260212016043808, 0.04620588252954174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b168142-b166-4b3e-9a6a-91e6da1ce52f", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["register", 25, 3, 12.0, 988.84, 135, 2864, 877.0, 1774.0000000000002, 2546.899999999999, 2864.0, 0.10033552198551958, 0.03210736703536626, 0.04526856558331059], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 1.4851485148514851, 0.46511627906976744], "isController": false}, {"data": ["401/Unauthorized", 9, 4.455445544554456, 1.3953488372093024], "isController": false}, {"data": ["404/Not Found", 190, 94.05940594059406, 29.45736434108527], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 645, 202, "404/Not Found", 190, "401/Unauthorized", 9, "406/Not Acceptable", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 61, 61, "404/Not Found", 61, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 23, "404/Not Found", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

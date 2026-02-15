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

    var data = {"OkPercent": 69.7749196141479, "KoPercent": 30.225080385852092};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5365997638724912, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68aab74e-9e1e-4ba0-afe1-fe3ce096c161"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41870735-6b32-4240-9f25-a7c8b75d250f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ce0a2a7-cc0a-4459-899b-8e9a3388778a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5ce0a2a7-cc0a-4459-899b-8e9a3388778a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41870735-6b32-4240-9f25-a7c8b75d250f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/61048b0e-9b65-4ed3-aab8-b5f680975bbc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=056eb8f9-a54c-4345-91b2-c497331a5467"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ce2b69d-42ee-40b7-a8db-d172945dbc31"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/056eb8f9-a54c-4345-91b2-c497331a5467"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=deeb74f5-b8ee-4686-b688-040dd0c76ff4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b900ff3-5f23-44df-9eea-a54a73d799b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ce2b69d-42ee-40b7-a8db-d172945dbc31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eaa1e005-9023-4b28-9b73-c1d5999cf6c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9573863636363636, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61048b0e-9b65-4ed3-aab8-b5f680975bbc"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8695652173913043, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a223d493-2a50-4557-abc8-ad7ada8aff99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fd53780-e2e7-4e06-a0b9-23b62ec57cf7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a09512e-b21a-449c-be26-cc1cfe1c33eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/deeb74f5-b8ee-4686-b688-040dd0c76ff4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e11f252-6846-4620-8998-c1e9fbe12294"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b39e4257-d209-4f0b-99df-760a6b2e5269"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a09512e-b21a-449c-be26-cc1cfe1c33eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fd53780-e2e7-4e06-a0b9-23b62ec57cf7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e11f252-6846-4620-8998-c1e9fbe12294"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3007b407-a9cd-4216-9fb1-8907ce507975"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/0bead459-7797-4c3b-b1cb-8e3c52587c3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b39e4257-d209-4f0b-99df-760a6b2e5269"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5002ab02-df39-4aad-a4bf-54bfc97e172d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00125d0f-9ee6-4927-bb68-c4609493da3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bead459-7797-4c3b-b1cb-8e3c52587c3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5002ab02-df39-4aad-a4bf-54bfc97e172d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f3a9309-219f-4266-a1b5-29730c68f298"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f3a9309-219f-4266-a1b5-29730c68f298"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3007b407-a9cd-4216-9fb1-8907ce507975"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00125d0f-9ee6-4927-bb68-c4609493da3e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 622, 188, 30.225080385852092, 308.6398713826368, 127, 2352, 143.0, 651.8000000000002, 1096.1500000000005, 1659.1599999999999, 2.4223542011488655, 2.549209394168046, 1.1652270348554183], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/68aab74e-9e1e-4ba0-afe1-fe3ce096c161", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["see books", 58, 58, 100.0, 749.5689655172415, 519, 1043, 797.5, 985.2, 1000.6999999999999, 1043.0, 0.2637010902676111, 1.6972383278168277, 0.4426779044629136], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 172.99999999999997, 129, 402, 139.0, 401.4, 402.0, 402.0, 0.08518177791406863, 0.06613233734539507, 0.030279460117891583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, 100.0, 231.63157894736844, 131, 420, 138.0, 411.0, 420.0, 420.0, 0.09691949050954148, 0.048175801434918564, 0.04864904113467219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, 100.0, 150.41176470588235, 128, 422, 132.0, 201.19999999999982, 422.0, 422.0, 0.13299953058989203, 0.06611011823267095, 0.06675953000312941], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 236.03448275862073, 127, 610, 135.0, 535.7, 549.4, 610.0, 0.2637850424784879, 0.13111971349760773, 0.12751327736997217], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 553.0666666666665, 388, 813, 474.0, 811.2, 813.0, 813.0, 0.09091460088490212, 0.01642500113643251, 0.061793517788956906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 553.0666666666665, 388, 813, 474.0, 811.2, 813.0, 813.0, 0.08944170487815059, 0.016158901760212754, 0.06079240878436798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1067.9166666666667, 133, 2059, 1134.0, 1740.0, 1999.0, 2059.0, 0.09664442502607386, 0.030626089766563447, 0.043603246447310666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41870735-6b32-4240-9f25-a7c8b75d250f", 3, 0, 0.0, 355.3333333333333, 250, 408, 408.0, 408.0, 408.0, 408.0, 0.04645760743321719, 0.029444323461091753, 0.02979215060007743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ce0a2a7-cc0a-4459-899b-8e9a3388778a", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ce0a2a7-cc0a-4459-899b-8e9a3388778a", 3, 0, 0.0, 733.3333333333334, 391, 931, 878.0, 931.0, 931.0, 931.0, 0.019656663608963437, 0.023233510925828857, 0.012605347431529287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41870735-6b32-4240-9f25-a7c8b75d250f", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 203.33333333333334, 131, 480, 138.0, 480.0, 480.0, 480.0, 0.05157149815202131, 0.04059240967825116, 0.01833205598372633], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 531.857142857143, 386, 1146, 416.0, 955.0, 1146.0, 1146.0, 0.09117848187827673, 0.016472674948712105, 0.06206191588785047], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1262.9565217391305, 789, 2352, 1161.0, 2068.800000000001, 2350.8, 2352.0, 0.09583253472887726, 0.04960082363896967, 0.044079222516895694], "isController": false}, {"data": ["goToProfile", 17, 0, 0.0, 293.1764705882353, 208, 878, 246.0, 501.99999999999966, 878.0, 878.0, 0.09458790276363596, 0.19235445460337067, 0.06114960120070997], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, 100.0, 163.22222222222223, 132, 389, 135.0, 389.0, 389.0, 389.0, 0.05123038303249714, 0.025465102503458053, 0.025715250858108916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61048b0e-9b65-4ed3-aab8-b5f680975bbc", 3, 0, 0.0, 390.0, 208, 609, 353.0, 609.0, 609.0, 609.0, 0.08319698272275992, 0.03764446809395713, 0.05335223175906154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=056eb8f9-a54c-4345-91b2-c497331a5467", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.2783729776579353, 1.062331471494607], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 829.9830508474575, 538, 2085, 800.0, 1009.0, 1327.0, 2085.0, 0.2759072203516648, 0.9215235397961092, 0.5396074094533296], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ce2b69d-42ee-40b7-a8db-d172945dbc31", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/056eb8f9-a54c-4345-91b2-c497331a5467", 3, 0, 0.0, 628.3333333333334, 215, 1072, 598.0, 1072.0, 1072.0, 1072.0, 0.041413583655438985, 0.026624943919105467, 0.026557538997791275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=deeb74f5-b8ee-4686-b688-040dd0c76ff4", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.2700509155455904, 1.030572683109118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b900ff3-5f23-44df-9eea-a54a73d799b0", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ce2b69d-42ee-40b7-a8db-d172945dbc31", 3, 0, 0.0, 335.6666666666667, 265, 397, 345.0, 397.0, 397.0, 397.0, 0.03717426054200072, 0.030990651447937452, 0.023838962652259578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaa1e005-9023-4b28-9b73-c1d5999cf6c5", 2, 0, 0.0, 325.0, 299, 351, 325.0, 351.0, 351.0, 351.0, 0.016032835246585005, 0.02711803774129417, 0.009965722299268903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 171.88235294117646, 131, 440, 138.0, 400.79999999999995, 440.0, 440.0, 0.12654270444090457, 0.0945362977512617, 0.04498197696922779], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 437.1333333333333, 215, 720, 424.0, 689.4, 720.0, 720.0, 0.08942517497525904, 0.016155915400803633, 0.06165446634036414], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 4, 2.272727272727273, 213.68181818181813, 127, 1687, 142.5, 392.3, 464.20000000000016, 1092.5599999999922, 0.7178223879014299, 1.5942257548860865, 0.3442260735217345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 233.50000000000003, 130, 591, 147.5, 591.0, 591.0, 591.0, 0.0412658293142135, 0.03195683852165166, 0.014668712764036829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61048b0e-9b65-4ed3-aab8-b5f680975bbc", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 0.6383889134275619, 2.4362301236749118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, 100.0, 185.18749999999997, 127, 422, 135.0, 402.40000000000003, 422.0, 422.0, 0.0697085745903532, 0.03465006295555643, 0.03499043685492339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 229.88235294117646, 133, 425, 141.0, 401.79999999999995, 425.0, 425.0, 0.11934514616270253, 0.0968513832628963, 0.04242346992502317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 388.95652173913044, 129, 848, 361.0, 775.2, 835.9999999999998, 848.0, 0.0971045943138927, 0.05964725568695167, 0.04390569059309797], "isController": false}, {"data": ["login", 23, 4, 17.391304347826086, 2026.826086956522, 1251, 3117, 1946.0, 2836.4000000000005, 3089.2, 3117.0, 0.09492717434820112, 0.14068987550094722, 0.14264468526482618], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, 100.0, 134.74999999999997, 128, 144, 134.5, 144.0, 144.0, 144.0, 0.04118891812157938, 0.02047378840223038, 0.020674906166495904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a223d493-2a50-4557-abc8-ad7ada8aff99", 2, 0, 0.0, 268.0, 253, 283, 268.0, 283.0, 283.0, 283.0, 0.035868005738880916, 0.03169975116571019, 0.02229490786406026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 150.42105263157893, 129, 394, 135.0, 150.0, 394.0, 394.0, 0.09434149635543904, 0.0763760746861904, 0.03353545378259747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 168.46666666666664, 131, 395, 134.0, 384.8, 395.0, 395.0, 0.08091400459591547, 0.040219949550118136, 0.04061503746318413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fd53780-e2e7-4e06-a0b9-23b62ec57cf7", 3, 0, 0.0, 308.3333333333333, 214, 418, 293.0, 418.0, 418.0, 418.0, 0.08218952905399853, 0.0380982712802389, 0.05270617585819567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a09512e-b21a-449c-be26-cc1cfe1c33eb", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/deeb74f5-b8ee-4686-b688-040dd0c76ff4", 3, 0, 0.0, 324.3333333333333, 246, 413, 314.0, 413.0, 413.0, 413.0, 0.022304169392731815, 0.022369513638999586, 0.01430312946083388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e11f252-6846-4620-8998-c1e9fbe12294", 3, 0, 0.0, 442.6666666666667, 251, 653, 424.0, 653.0, 653.0, 653.0, 0.02079679452073787, 0.024581107065364326, 0.013336486069613804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b39e4257-d209-4f0b-99df-760a6b2e5269", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a09512e-b21a-449c-be26-cc1cfe1c33eb", 3, 0, 0.0, 334.0, 263, 386, 353.0, 386.0, 386.0, 386.0, 0.02117104083893778, 0.029185988916960122, 0.013576481267157364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fd53780-e2e7-4e06-a0b9-23b62ec57cf7", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e11f252-6846-4620-8998-c1e9fbe12294", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3007b407-a9cd-4216-9fb1-8907ce507975", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.2509223090277778, 0.9575737847222222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bead459-7797-4c3b-b1cb-8e3c52587c3a", 2, 0, 0.0, 515.0, 234, 796, 515.0, 796.0, 796.0, 796.0, 0.016347882949158083, 0.027938276524440083, 0.010161550290174922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 171.24999999999997, 129, 417, 135.0, 400.90000000000003, 417.0, 417.0, 0.07255380317967042, 0.060154471581582214, 0.02579060972402347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b39e4257-d209-4f0b-99df-760a6b2e5269", 3, 0, 0.0, 286.0, 211, 414, 233.0, 414.0, 414.0, 414.0, 0.018280421668393148, 0.02520103703308756, 0.011722796447504721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 151.125, 128, 402, 134.5, 219.30000000000018, 402.0, 402.0, 0.09180312819159313, 0.045632609618672756, 0.04608086708054577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5002ab02-df39-4aad-a4bf-54bfc97e172d", 3, 0, 0.0, 277.6666666666667, 215, 400, 218.0, 400.0, 400.0, 400.0, 0.04824159390226253, 0.03000966339427855, 0.03093617838133372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 154.37500000000003, 129, 395, 137.0, 221.40000000000018, 395.0, 395.0, 0.08801703129555569, 0.06833353503903006, 0.031287304093342065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00125d0f-9ee6-4927-bb68-c4609493da3e", 3, 0, 0.0, 312.0, 216, 449, 271.0, 449.0, 449.0, 449.0, 0.07685804319422027, 0.03477626303384316, 0.049287221709835266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bead459-7797-4c3b-b1cb-8e3c52587c3a", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5002ab02-df39-4aad-a4bf-54bfc97e172d", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f3a9309-219f-4266-a1b5-29730c68f298", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 149.52941176470586, 131, 387, 134.0, 191.79999999999984, 387.0, 387.0, 0.1129553095639925, 0.05614673102350799, 0.05669827062098842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, 100.0, 202.75, 134, 401, 138.0, 401.0, 401.0, 401.0, 0.10583410504034925, 0.05260699166556423, 0.05942833046699299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f3a9309-219f-4266-a1b5-29730c68f298", 3, 0, 0.0, 422.33333333333337, 242, 764, 261.0, 764.0, 764.0, 764.0, 0.09267840593141798, 0.041934565183812174, 0.059432441303676246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3007b407-a9cd-4216-9fb1-8907ce507975", 3, 0, 0.0, 657.6666666666666, 228, 1146, 599.0, 1146.0, 1146.0, 1146.0, 0.04930885422659062, 0.03170084215413948, 0.03162058685754672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00125d0f-9ee6-4927-bb68-c4609493da3e", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1067.9166666666667, 133, 2059, 1134.0, 1740.0, 1999.0, 2059.0, 0.0991813406837727, 0.031430024464730706, 0.04474783144131151], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.6595744680851063, 0.8038585209003215], "isController": false}, {"data": ["401/Unauthorized", 4, 2.127659574468085, 0.6430868167202572], "isController": false}, {"data": ["404/Not Found", 179, 95.2127659574468, 28.778135048231512], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 622, 188, "404/Not Found", 179, "406/Not Acceptable", 5, "401/Unauthorized", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, "404/Not Found", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

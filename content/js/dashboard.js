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

    var data = {"OkPercent": 97.60299625468164, "KoPercent": 2.397003745318352};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7969151670951157, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3813559322033898, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3c90f5d-1ca6-4cea-ac28-66eb443c8390"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c418543-22a4-447a-8f7d-593a94c7a500"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79ec0711-7070-4958-95f4-e30794b20411"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a909a081-5ec1-4c43-8be3-176703ed2ec2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b92c603c-89b3-472e-a2ef-bd44d423158b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7b563f14-2796-4e82-b196-14bf27687d77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1ad7eb6-dcb7-45d1-a386-c6531ae8129f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a52dcc8-0e34-46ac-a3de-7ffa09312425"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=331d0f0a-3d8a-47d7-b880-ef8e72cf350a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b742660-8d22-4cee-ba90-8225b1b98a06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1ad7eb6-dcb7-45d1-a386-c6531ae8129f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b92c603c-89b3-472e-a2ef-bd44d423158b"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b563f14-2796-4e82-b196-14bf27687d77"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3c90f5d-1ca6-4cea-ac28-66eb443c8390"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a909a081-5ec1-4c43-8be3-176703ed2ec2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c418543-22a4-447a-8f7d-593a94c7a500"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b73454f2-94bd-4c56-a4bb-5689942394f8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b742660-8d22-4cee-ba90-8225b1b98a06"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/331d0f0a-3d8a-47d7-b880-ef8e72cf350a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b5d0e919-3286-4ba6-afa3-7628bd274f6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4fefdac-5ed5-49c4-b136-83b6bdcd72d7"], "isController": false}, {"data": [0.8135593220338984, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a52dcc8-0e34-46ac-a3de-7ffa09312425"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9364161849710982, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c626a058-e3d7-4435-bab2-816ea4a7740b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b73454f2-94bd-4c56-a4bb-5689942394f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5d0e919-3286-4ba6-afa3-7628bd274f6c"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2182acef-696e-460b-899d-cda22902a855"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/79ec0711-7070-4958-95f4-e30794b20411"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 32, 2.397003745318352, 315.9558052434463, 0, 2862, 94.0, 877.0, 1121.2, 1813.3600000000024, 5.201048780772872, 739.790929131084, 3.8031451735436095], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 1, 1.694915254237288, 1344.5593220338985, 976, 1883, 1313.0, 1631.0, 1703.0, 1883.0, 0.26526391511554714, 319.2098739153404, 1.3016574428446184], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a3c90f5d-1ca6-4cea-ac28-66eb443c8390", 3, 0, 0.0, 601.3333333333334, 250, 1047, 507.0, 1047.0, 1047.0, 1047.0, 0.04839412172734752, 0.03111275729541385, 0.031033990821248247], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 540.6, 84, 1176, 519.0, 1051.2, 1176.0, 1176.0, 0.08978326320262886, 0.018272296925222514, 0.060165307821917896], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 540.6, 84, 1176, 519.0, 1051.2, 1176.0, 1176.0, 0.0889052211072849, 0.018093601639412277, 0.05957691672247939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 117.55555555555556, 79, 243, 82.0, 243.0, 243.0, 243.0, 0.09668738283369233, 0.03393920176508189, 0.05469089916580275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c418543-22a4-447a-8f7d-593a94c7a500", 3, 0, 0.0, 325.6666666666667, 195, 564, 218.0, 564.0, 564.0, 564.0, 0.03051602599965415, 0.030605428419575014, 0.019569196360455298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79ec0711-7070-4958-95f4-e30794b20411", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 110.16666666666667, 81, 250, 83.0, 243.70000000000002, 250.0, 250.0, 0.09668894093380032, 0.07185574614318559, 0.048533316054661484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 138.1666666666667, 80, 439, 83.0, 268.0000000000003, 439.0, 439.0, 0.09660487532604145, 1.602649304847418, 0.05642622003907131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a909a081-5ec1-4c43-8be3-176703ed2ec2", 3, 0, 0.0, 635.6666666666666, 186, 1230, 491.0, 1230.0, 1230.0, 1230.0, 0.0625, 0.028279622395833332, 0.040079752604166664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 188.22222222222223, 80, 1029, 82.0, 765.3000000000004, 1029.0, 1029.0, 0.09635252175961116, 9.656214286001049, 0.055724711477726514], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 189.6, 80, 302, 195.0, 281.6, 302.0, 302.0, 0.08977896419016382, 0.1697149742334373, 0.058023162598682045], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b92c603c-89b3-472e-a2ef-bd44d423158b", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b563f14-2796-4e82-b196-14bf27687d77", 3, 0, 0.0, 1110.0, 235, 2473, 622.0, 2473.0, 2473.0, 2473.0, 0.031245117950320263, 0.026047769228766338, 0.02003674556058949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 83.84210526315789, 81, 91, 83.0, 87.0, 91.0, 91.0, 0.10329960691781157, 0.07676855553169394, 0.051851560503667134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 614.3333333333333, 481, 725, 637.5, 725.0, 725.0, 725.0, 0.031176605075551304, 9.166957052927483, 0.017780407582150354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 90.68421052631578, 80, 239, 82.0, 94.0, 239.0, 239.0, 0.10321318955917103, 0.03577661134801858, 0.058407546106418226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 809.1666666666666, 635, 963, 828.0, 963.0, 963.0, 963.0, 0.031163974445540955, 28.041398986521582, 0.0177427706071781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 136.0, 79, 249, 83.5, 249.0, 249.0, 249.0, 0.031239586804398534, 0.05527942508747084, 0.017297700896576142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1ad7eb6-dcb7-45d1-a386-c6531ae8129f", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a52dcc8-0e34-46ac-a3de-7ffa09312425", 3, 0, 0.0, 501.0, 180, 980, 343.0, 980.0, 980.0, 980.0, 0.04978839930296241, 0.03200914343208033, 0.03192810762592316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 88.57142857142857, 81, 139, 83.5, 121.0, 139.0, 139.0, 0.08100164317619014, 0.06019751021199287, 0.04065902792242357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=331d0f0a-3d8a-47d7-b880-ef8e72cf350a", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 118.07142857142857, 81, 244, 83.5, 242.5, 244.0, 244.0, 0.08099461385817844, 0.0216723869112704, 0.046192240715992386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 84.21428571428571, 80, 106, 82.0, 97.0, 106.0, 106.0, 0.08099086538739667, 0.021829569186446757, 0.04761377047188749], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b742660-8d22-4cee-ba90-8225b1b98a06", 3, 0, 0.0, 291.0, 193, 453, 227.0, 453.0, 453.0, 453.0, 0.03360516175284524, 0.02751203834909042, 0.021550185108432655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 141.14285714285714, 80, 245, 88.0, 243.5, 245.0, 245.0, 0.08099320814097447, 0.02183020063174702, 0.04769424268457773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 83.5, 81, 87, 83.0, 87.0, 87.0, 87.0, 0.031266447454129515, 0.023236100109953674, 0.01755684305285593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 532.6666666666667, 80, 1086, 502.0, 1082.4, 1086.0, 1086.0, 0.08518008489615127, 38.334074407466034, 0.046416491574269934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 134.57894736842107, 80, 909, 82.0, 242.0, 909.0, 909.0, 0.10329848368699472, 4.9183850658256, 0.06026098837620221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 387.22222222222223, 80, 729, 434.0, 723.6, 729.0, 729.0, 0.08518169729264173, 12.534603215963998, 0.0465005554556511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 149.9473684210526, 81, 717, 83.0, 244.0, 717.0, 717.0, 0.10321206820688043, 1.6236060429307884, 0.06031136942043708], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 467.53333333333336, 85, 1791, 430.0, 1072.2000000000005, 1791.0, 1791.0, 0.08894423196655697, 0.01810154095881882, 0.06005472849773192], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 231.07142857142856, 164, 343, 173.5, 336.5, 343.0, 343.0, 0.08095152738185414, 0.12545905659668213, 0.18206188238321294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 685.0952380952381, 288, 1248, 589.0, 1163.6, 1240.1, 1248.0, 0.09308469377352051, 0.057178000374555074, 0.042088098844863274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 85.66666666666667, 81, 131, 83.0, 89.60000000000007, 131.0, 131.0, 0.08519822787686016, 0.06331626114676815, 0.042765516727252074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 102.33333333333333, 81, 241, 83.0, 241.0, 241.0, 241.0, 0.08518774432318336, 0.08676837629792994, 0.04500641570199434], "isController": false}, {"data": ["login", 21, 0, 0.0, 3184.6666666666665, 2102, 4263, 3135.0, 4155.4, 4254.9, 4263.0, 0.09276028093113653, 31.83287482331375, 0.18390295093643713], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 112.52631578947367, 82, 247, 87.0, 246.0, 247.0, 247.0, 0.10412898841427992, 0.08429973769085747, 0.037014601350388567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 638.0555555555555, 167, 1173, 642.5, 1165.8, 1173.0, 1173.0, 0.08514623866490699, 50.99823155253522, 0.18060315466814253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 336.3888888888889, 163, 1271, 172.5, 864.2000000000006, 1271.0, 1271.0, 0.09630818619582665, 11.354877273943284, 0.21477059925093633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 488.1666666666667, 80, 1048, 407.0, 1025.8000000000002, 1048.0, 1048.0, 0.06230044389066272, 37.274830133945954, 0.09088016412273187], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1158.0416666666667, 314, 2228, 1169.0, 1784.0, 2150.75, 2228.0, 0.0945317331211621, 0.02954116660036316, 0.04265005927927431], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d1ad7eb6-dcb7-45d1-a386-c6531ae8129f", 3, 0, 0.0, 483.0, 206, 1011, 232.0, 1011.0, 1011.0, 1011.0, 0.021977860968051516, 0.03029825559886008, 0.014093875685892411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 91.17647058823529, 83, 116, 88.0, 107.19999999999999, 116.0, 116.0, 0.08324315325064514, 0.06462725276783485, 0.02959033963206526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 253.78947368421058, 165, 997, 168.0, 335.0, 997.0, 997.0, 0.10316387309757674, 6.6472509033625995, 0.2306287346000771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 333.5, 164, 1043, 173.5, 1003.0, 1043.0, 1043.0, 0.11613823768519901, 20.00309399523833, 0.2569526104142817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 98.36363636363637, 81, 251, 83.0, 218.0000000000001, 251.0, 251.0, 0.06004334037477961, 0.04462205275899149, 0.0301389423365593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 97.0909090909091, 81, 244, 82.0, 212.0000000000001, 244.0, 244.0, 0.0599912739965096, 0.024243632744328097, 0.03375574348276614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 154.36363636363635, 80, 721, 82.0, 625.4000000000003, 721.0, 721.0, 0.05983561524611476, 4.9092243145422305, 0.034709331500187665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b92c603c-89b3-472e-a2ef-bd44d423158b", 3, 0, 0.0, 356.0, 186, 500, 382.0, 500.0, 500.0, 500.0, 0.017867459187745308, 0.024631734915397583, 0.011457973502558024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 162.36363636363637, 81, 641, 84.0, 561.4000000000003, 641.0, 641.0, 0.05986166513384524, 1.6147875489097014, 0.034782901127576094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 85.66666666666667, 85, 87, 85.0, 87.0, 87.0, 87.0, 0.028122275654545965, 0.008293874265305548, 0.01738418016535898], "isController": false}, {"data": ["https://demoqa.com/books", 59, 1, 1.694915254237288, 933.6101694915254, 637, 1480, 877.0, 1291.0, 1314.0, 1480.0, 0.2583040369856357, 305.0903048288626, 0.5078520049209108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b563f14-2796-4e82-b196-14bf27687d77", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1158.0416666666667, 314, 2228, 1169.0, 1784.0, 2150.75, 2228.0, 0.09361177636146627, 0.029253680112958213, 0.042235000663083416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 82.6, 81, 86, 82.0, 86.0, 86.0, 86.0, 0.027014322994051446, 0.007281204244490429, 0.015907848403723654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 81.8, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.027014906825586358, 0.007281361605333823, 0.01588181045801073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 112.3529411764706, 80, 247, 82.0, 243.8, 247.0, 247.0, 0.08226032004103338, 0.02217172688605978, 0.04836007096162314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 93.11764705882354, 80, 242, 81.0, 131.5999999999999, 242.0, 242.0, 0.08226032004103338, 0.02217172688605978, 0.048440403305413215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3c90f5d-1ca6-4cea-ac28-66eb443c8390", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 85.00000000000001, 81, 94, 84.0, 92.4, 94.0, 94.0, 0.08225514578514956, 0.0611290683032215, 0.041288227474186395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 81.4, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.027014906825586358, 0.0072285981154401, 0.01540693904896722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 121.17647058823529, 80, 247, 82.0, 244.6, 247.0, 247.0, 0.08226032004103338, 0.022011062198479637, 0.04691408877340185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 82.6, 82, 84, 82.0, 84.0, 84.0, 84.0, 0.027014614906664507, 0.020076290960909852, 0.01356007037307183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 86.6, 84, 89, 88.0, 89.0, 89.0, 89.0, 0.027070779259451762, 0.02130766414367004, 0.009622816064883244], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 638.3333333333333, 81, 2104, 500.0, 1469.8000000000004, 2104.0, 2104.0, 0.09070623877510296, 0.017964087132412966, 0.06172276091649584], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1784.142857142857, 1122, 2862, 1615.0, 2692.4, 2846.2, 2862.0, 0.09426043709911261, 0.04878714029543914, 0.043356119017267616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a909a081-5ec1-4c43-8be3-176703ed2ec2", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 166.8, 165, 169, 167.0, 169.0, 169.0, 169.0, 0.027001922536884628, 0.04184770611917569, 0.06072795664301298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c418543-22a4-447a-8f7d-593a94c7a500", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b73454f2-94bd-4c56-a4bb-5689942394f8", 3, 0, 0.0, 284.3333333333333, 174, 493, 186.0, 493.0, 493.0, 493.0, 0.07231355155956226, 0.033520344212505424, 0.0463729481029745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b742660-8d22-4cee-ba90-8225b1b98a06", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["addBook", 57, 10, 17.54385964912281, 879.9649122807018, 420, 2205, 748.0, 1534.2, 1761.3999999999996, 2205.0, 0.2701998056457538, 80.43138272972908, 0.9830619607854755], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 154.1186440677966, 80, 369, 84.0, 335.0, 338.0, 369.0, 0.2590264119134588, 0.19249912057240445, 0.1252129627901974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/331d0f0a-3d8a-47d7-b880-ef8e72cf350a", 3, 0, 0.0, 334.0, 268, 466, 268.0, 466.0, 466.0, 466.0, 0.0200253654629197, 0.023669304035111142, 0.01284178709698952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5d0e919-3286-4ba6-afa3-7628bd274f6c", 3, 0, 0.0, 681.0, 302, 1153, 588.0, 1153.0, 1153.0, 1153.0, 0.01714687441057619, 0.023638350627861383, 0.010995879748969758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4fefdac-5ed5-49c4-b136-83b6bdcd72d7", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 521.2542372881356, 397, 808, 481.0, 642.0, 721.0, 808.0, 0.2589854792548241, 76.15033002815917, 0.13025148614866644], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 126.6949152542373, 80, 338, 84.0, 247.0, 304.0, 338.0, 0.25934749927470613, 0.4589235045759449, 0.1261279830457067], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 1, 1.694915254237288, 764.1186440677964, 0, 1138, 759.0, 965.0, 1036.0, 1138.0, 0.25871746299024767, 228.85701163378982, 0.12766295363256858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a52dcc8-0e34-46ac-a3de-7ffa09312425", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 89.85714285714286, 83, 106, 88.0, 102.0, 106.0, 106.0, 0.12102665179767802, 0.09041541857931999, 0.04302119263120586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 10, 5.780346820809249, 146.1618497109825, 82, 1072, 88.0, 265.2, 423.29999999999995, 701.2599999999954, 0.6922325901502905, 1.5257470260007362, 0.32988427861761555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 92.0, 81, 122, 88.0, 117.40000000000002, 122.0, 122.0, 0.0601997537282802, 0.046619535846216996, 0.021399131208099605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c626a058-e3d7-4435-bab2-816ea4a7740b", 1, 0, 0.0, 1286.0, 1286, 1286, 1286.0, 1286.0, 1286.0, 1286.0, 0.7776049766718507, 0.24831721423017106, 0.46398109447900465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 90.05555555555556, 82, 112, 86.0, 100.30000000000001, 112.0, 112.0, 0.09584103167546097, 0.07777724347881647, 0.03406849172838652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b73454f2-94bd-4c56-a4bb-5689942394f8", 1, 0, 0.0, 1791.0, 1791, 1791, 1791.0, 1791.0, 1791.0, 1791.0, 0.5583472920156337, 0.10087329006141821, 0.3849542853154662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5d0e919-3286-4ba6-afa3-7628bd274f6c", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 268.9090909090909, 164, 804, 168.0, 742.2000000000003, 804.0, 804.0, 0.05980796207087787, 6.588911077114211, 0.1331183786469264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2182acef-696e-460b-899d-cda22902a855", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.8104973032994923, 1.5144154505076142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 217.76470588235296, 164, 334, 172.0, 334.0, 334.0, 334.0, 0.08222252316740505, 0.1274288518229217, 0.1849203816938807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79ec0711-7070-4958-95f4-e30794b20411", 3, 0, 0.0, 936.0, 195, 2104, 509.0, 2104.0, 2104.0, 2104.0, 0.027040669166426307, 0.02729593590009374, 0.017340533287063743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 113.2857142857143, 84, 247, 90.0, 246.0, 247.0, 247.0, 0.08348589386557578, 0.06921828505065804, 0.02967662633502889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 97.77777777777777, 83, 250, 86.5, 125.8000000000002, 250.0, 250.0, 0.08350730688935282, 0.06483233298538622, 0.029684237995824633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 95.50000000000001, 81, 245, 83.0, 167.5, 245.0, 245.0, 0.11622501162250116, 0.08637425180148768, 0.05833950778707578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 116.57142857142858, 80, 248, 82.0, 246.0, 248.0, 248.0, 0.11622404675527366, 0.05603659397129266, 0.06488959753272952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 225.85714285714283, 80, 960, 86.5, 839.0, 960.0, 960.0, 0.11621825788831425, 14.96590563596291, 0.06689683761818982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 196.28571428571428, 81, 648, 83.5, 638.5, 648.0, 648.0, 0.11622404675527366, 4.908812117602132, 0.0670136698157849], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.0, 0.599250936329588], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.2247191011235955], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 3.125, 0.0749063670411985], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.2247191011235955], "isController": false}, {"data": ["401/Unauthorized", 16, 50.0, 1.198501872659176], "isController": false}, {"data": ["Assertion failed", 1, 3.125, 0.0749063670411985], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 32, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 59, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
